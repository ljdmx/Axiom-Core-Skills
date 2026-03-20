# DeFi Protocol Integration Reference Manual

## Table of Contents
1. [Uniswap V3 Integration](#1-uniswap-v3)
2. [Aave V3 Lending Integration](#2-aave-v3)
3. [Chainlink Price Oracles](#3-chainlink-oracles)
4. [Flash Loans (Aave)](#4-flash-loan)
5. [ERC-4626 Vault Integration](#5-erc-4626-vault)
6. [Safe Multi-sig Integration (SDK)](#6-safe-multi-sig)

> For full ERC-4626 contract implementation see `references/solidity-patterns.md §5`
> For security (Oracle Manipulation / Flash Loan attacks) see `references/security.md`

---

## 1. Uniswap V3

### Reading Pool Data

```solidity
interface IUniswapV3Pool {
    function slot0() external view returns (
        uint160 sqrtPriceX96, int24 tick, uint16 observationIndex,
        uint16 observationCardinality, uint16 observationCardinalityNext,
        uint8 feeProtocol, bool unlocked
    );
    function liquidity() external view returns (uint128);
    function observe(uint32[] calldata secondsAgos) external view returns (
        int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s
    );
}

// TWAP Price (Resistant to flash-loan manipulation)
function getTWAP(address pool, uint32 twapInterval) internal view returns (uint256 price) {
    uint32[] memory ages = new uint32[](2);
    ages[0] = twapInterval; ages[1] = 0;
    (int56[] memory ticks,) = IUniswapV3Pool(pool).observe(ages);
    int24 tick = int24((ticks[1] - ticks[0]) / int32(twapInterval));
    // Convert tick to price: price = 1.0001^tick (Using TickMath Library)
    // import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
    uint160 sqrtPrice = TickMath.getSqrtRatioAtTick(tick);
    price = uint256(sqrtPrice) ** 2 >> (96 * 2 - 18);
}
```

### SwapRouter Swaps

```solidity
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// SwapRouter02 (Recommended):
// Mainnet/Arbitrum/Base: 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45

contract UniswapV3Integration {
    using SafeERC20 for IERC20;
    ISwapRouter public immutable router;

    uint24 public constant FEE_LOW    = 500;    // 0.05% (Stablecoins)
    uint24 public constant FEE_MEDIUM = 3_000;  // 0.3% (Mainstream tokens)
    uint24 public constant FEE_HIGH   = 10_000; // 1.0% (Long-tail tokens)

    constructor(address _router) { router = ISwapRouter(_router); }

    /// @notice Exact input single-hop swap
    function swapExactInput(
        address tokenIn, address tokenOut,
        uint256 amountIn, uint256 amountOutMin,
        uint24  fee
    ) external returns (uint256 amountOut) {
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);

        amountOut = router.exactInputSingle(ISwapRouter.ExactInputSingleParams({
            tokenIn:           tokenIn,
            tokenOut:          tokenOut,
            fee:               fee,
            recipient:         msg.sender,
            amountIn:          amountIn,
            amountOutMinimum:  amountOutMin,
            sqrtPriceLimitX96: 0,
        }));
    }

    /// @notice Multi-hop swap (A �?B �?C)
    function swapMultihop(
        address tokenIn, address tokenMid, address tokenOut,
        uint256 amountIn, uint256 amountOutMin
    ) external returns (uint256 amountOut) {
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);

        // Path: token + fee + token + fee + token
        bytes memory path = abi.encodePacked(
            tokenIn, uint24(3000), tokenMid, uint24(3000), tokenOut
        );

        amountOut = router.exactInput(ISwapRouter.ExactInputParams({
            path:             path,
            recipient:        msg.sender,
            amountIn:         amountIn,
            amountOutMinimum: amountOutMin,
        }));
    }

    /// @notice Get single-hop swap quote (Use Quoter contract off-chain)
    // Quoter V2: 0x61fFE014bA17989E743c5F6cB21bF9697530B21e
    // Frontend uses QuoterV2.quoteExactInputSingle() for quotes; calling within a contract is not recommended (high gas)
}
```

---

## 2. Aave V3

```solidity
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Provider Address (Unified entrypoint across all EVM chains):
// 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e (Mainnet/Arbitrum/Optimism/Base/Polygon)

contract AaveV3Integration {
    using SafeERC20 for IERC20;
    IPool public immutable pool;

    constructor(address provider) {
        pool = IPool(IPoolAddressesProvider(provider).getPool());
    }

    // ── Supply ──────────────────────────────────────────────────
    function supply(address asset, uint256 amount) external {
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(asset).approve(address(pool), amount);
        pool.supply(asset, amount, msg.sender, 0);
        // msg.sender receives aTokens, interest accrues automatically
    }

    // ── Withdraw ──────────────────────────────────────────────────
    function withdraw(address asset, uint256 amount) external returns (uint256) {
        // User must approve aTokens to this contract first (or user calls pool.withdraw directly)
        return pool.withdraw(asset, amount, msg.sender);
    }

    // ── Borrow ──────────────────────────────────────────────────
    /// @param interestRateMode 1=Stable (Deprecated), 2=Variable (Recommended)
    function borrow(address asset, uint256 amount, uint256 interestRateMode) external {
        pool.borrow(asset, amount, interestRateMode, 0, msg.sender);
    }

    // ── Repay ──────────────────────────────────────────────────
    function repay(address asset, uint256 amount, uint256 interestRateMode) external {
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(asset).approve(address(pool), amount);
        pool.repay(asset, amount, interestRateMode, msg.sender);
    }

    // ── Account State ───────────────────────────────────────────────
    function getHealthFactor(address user) external view returns (uint256 healthFactor) {
        (,,,,, healthFactor) = pool.getUserAccountData(user);
        // healthFactor < 1e18 �?Position can be liquidated!
    }

    // ── Liquidation ───────────────────────────────────────────────────
    function liquidate(
        address collateralAsset, address debtAsset,
        address borrower, uint256 debtToCover
    ) external {
        (,,,,, uint256 hf) = pool.getUserAccountData(borrower);
        require(hf < 1e18, "Position is healthy");

        IERC20(debtAsset).safeTransferFrom(msg.sender, address(this), debtToCover);
        IERC20(debtAsset).approve(address(pool), debtToCover);

        // receiveAToken=false: Receive underlying asset (including 5-15% liquidation bonus)
        pool.liquidationCall(collateralAsset, debtAsset, borrower, debtToCover, false);

        // Transfer received collateral to caller
        uint256 received = IERC20(collateralAsset).balanceOf(address(this));
        if (received > 0) IERC20(collateralAsset).safeTransfer(msg.sender, received);
    }
}
```

---

## 3. Chainlink Oracles

```solidity
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// Price Feed Addresses (Full list �?https://docs.chain.link/data-feeds/price-feeds/addresses)
// Mainnet ETH/USD: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
// Mainnet BTC/USD: 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c
// Mainnet USDC/USD:0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6

library ChainlinkLib {
    uint256 constant STALENESS_THRESHOLD = 1 hours;

    function getPrice(address feed) internal view returns (int256 price, uint8 decimals) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);
        (uint80 roundId, int256 _price,, uint256 updatedAt, uint80 answeredInRound) =
            priceFeed.latestRoundData();

        // Security Checks (Crucial!)
        require(_price > 0,                                "Chainlink: invalid price");
        require(updatedAt >= block.timestamp - STALENESS_THRESHOLD, "Chainlink: stale price");
        require(answeredInRound >= roundId,                "Chainlink: stale round");

        return (_price, priceFeed.decimals());
    }

    /// @notice Normalize price to 18 decimals
    function getPriceWAD(address feed) internal view returns (uint256) {
        (int256 price, uint8 dec) = getPrice(feed);
        uint256 p = uint256(price);
        return dec < 18 ? p * 10 ** (18 - dec) : p / 10 ** (dec - 18);
    }
}
```

---

## 4. Flash Loan

```solidity
import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AaveFlashLoan is FlashLoanSimpleReceiverBase {
    address public immutable owner;

    constructor(address provider) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(provider)) {
        owner = msg.sender;
    }

    /// @notice Request Flash Loan (Fee is approx 0.05%)
    function requestFlashLoan(address asset, uint256 amount, bytes calldata params) external {
        require(msg.sender == owner, "Not owner");
        POOL.flashLoanSimple(address(this), asset, amount, params, 0);
    }

    /// @notice Aave Callback �?Implement arbitrage / liquidation / leverage logic here
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,   // Fee (amount * 0.0005)
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Not Aave");
        require(initiator == address(this), "Not self");

        // ══════════════════════════════════════════
        // Use the borrowed funds here:
        // 1. Arbitrage: Buy low on Exchange A �?Sell high on Exchange B
        // 2. Liquidation: Pay borrower's debt �?Receive collateral + bonus
        // 3. Leveraged Position (Looping supply/borrow)
        // ══════════════════════════════════════════
        (address strategy) = abi.decode(params, (address));
        // IStrategy(strategy).execute(asset, amount);

        // Repayment: Principal + Premium(Fee)
        IERC20(asset).approve(address(POOL), amount + premium);
        return true;
    }
}
```

---

## 5. ERC-4626 Vault

**Integrating External ERC-4626 Vaults (e.g., Yearn v3, Morpho):**

```solidity
import "@openzeppelin/contracts/interfaces/IERC4626.sol";

contract VaultIntegration {
    IERC4626 public immutable vault;

    constructor(address _vault) { vault = IERC4626(_vault); }

    /// @notice Deposit underlying assets, receive share tokens
    function deposit(uint256 assets) external returns (uint256 shares) {
        IERC20(vault.asset()).transferFrom(msg.sender, address(this), assets);
        IERC20(vault.asset()).approve(address(vault), assets);
        shares = vault.deposit(assets, msg.sender);
    }

    /// @notice Preview how many shares you will get for a deposit
    function previewDeposit(uint256 assets) external view returns (uint256) {
        return vault.previewDeposit(assets);
    }

    /// @notice Current value per share (pricePerShare)
    function pricePerShare() external view returns (uint256) {
        return vault.convertToAssets(10 ** vault.decimals());
    }

    /// @notice APY estimation (Requires off-chain historical data; contract only provides current state)
    // APY = (pricePerShare_now / pricePerShare_7days_ago)^(365/7) - 1
}
```

> For full ERC-4626 contract implementation (SimpleVault + AaveVault) see `references/solidity-patterns.md §5`

---

## 6. Safe Multi-sig

**For production projects, use the Safe SDK rather than implementing your own multisig contract:**

```typescript
// npm install @safe-global/protocol-kit @safe-global/api-kit @safe-global/types-kit
import Safe, { SafeFactory } from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';

// ── Create a New Safe Wallet ────────────────────────────────────────
const safeFactory = await SafeFactory.create({ provider, signer: privateKey });
const safe = await safeFactory.deploySafe({
    safeAccountConfig: {
        owners:    [owner1, owner2, owner3],
        threshold: 2,   // 2/3 multi-sig
    },
});
const safeAddress = await safe.getAddress();

// ── Propose and Execute Multi-sig Transaction ────────────────────────────────────────
const apiKit = new SafeApiKit({ chainId: 1n });   // mainnet

// Build Transaction
const safeTx = await safe.createTransaction({
    transactions: [{
        to:    tokenAddress,
        value: '0',
        data:  token.interface.encodeFunctionData('transfer', [recipient, amount]),
    }],
});

// Signer 1 signs and submits to Safe API
const safeTxHash = await safe.getTransactionHash(safeTx);
const sig1 = await safe.signHash(safeTxHash);
await apiKit.proposeTransaction({
    safeAddress, safeTransactionData: safeTx.data,
    safeTxHash, senderAddress: owner1, senderSignature: sig1.data,
});

// Signer 2 confirms (Can be done in Safe App, or via API)
const sig2 = await safe2.signHash(safeTxHash);
await apiKit.confirmTransaction(safeTxHash, sig2.data);

// Execute (Once threshold is met)
const pendingTx = await apiKit.getTransaction(safeTxHash);
const executedTx = await safe.executeTransaction(pendingTx);
console.log('Safe Tx Executed:', executedTx.hash);

// ── Query Safe Info ────────────────────────────────────────────
const info = await apiKit.getSafeInfo(safeAddress);
console.log('Owners:', info.owners);
console.log('Threshold:', info.threshold);
const pending = await apiKit.getPendingTransactions(safeAddress);
```

---

## 7. Uniswap V4 Hooks

Uniswap V4 (Mainnet launch Q1 2024) introduced the Hooks mechanism, allowing custom logic to be inserted at key points in a liquidity pool's lifecycle. This is a major upgrade for DeFi composability.

```bash
# Uniswap V4 Core Libraries (Still iterating quickly, lock versions is recommended)
npm install @uniswap/v4-core @uniswap/v4-periphery
```

### V4 Architecture Changes

```
V3 Architecture: Each Pool = Independent Contract (Unique Address)
V4 Architecture: All Pools �?PoolManager Singleton Contract (ERC-6909 Accounting)
                 Custom Logic �?Hook Contract (Triggered at PoolManager hook points)

Hook Trigger Points:
  beforeInitialize / afterInitialize    �?On pool creation
  beforeAddLiquidity / afterAddLiquidity �?Adding liquidity
  beforeRemoveLiquidity / afterRemoveLiquidity
  beforeSwap / afterSwap                �?Before/After swaps (Most common)
  beforeDonate / afterDonate
```

### Minimal Hook Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { BaseHook }       from "@uniswap/v4-periphery/src/base/hooks/BaseHook.sol";
import { IPoolManager }   from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { Hooks }          from "@uniswap/v4-core/src/libraries/Hooks.sol";
import { PoolKey }        from "@uniswap/v4-core/src/types/PoolKey.sol";
import { BalanceDelta }   from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import { BeforeSwapDelta, BeforeSwapDeltaLibrary } from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";

/// @title DynamicFeeHook �?Dynamically adjusts trading fees based on volatility
contract DynamicFeeHook is BaseHook {
    uint24 public constant BASE_FEE  = 3_000;   // 0.3%
    uint24 public constant HIGH_FEE  = 10_000;  // 1.0% (High volatility)
    bool   public isHighVolatility;

    constructor(IPoolManager _manager) BaseHook(_manager) {}

    // ── Declare which Hook trigger points are used (Affects contract address! See deployment below)
    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize:         false,
            afterInitialize:          false,
            beforeAddLiquidity:       false,
            afterAddLiquidity:        false,
            beforeRemoveLiquidity:    false,
            afterRemoveLiquidity:     false,
            beforeSwap:               true,   // �?Enabled
            afterSwap:                false,
            beforeDonate:             false,
            afterDonate:              false,
            beforeSwapReturnDelta:    false,
            afterSwapReturnDelta:     false,
            afterAddLiquidityReturnDelta:    false,
            afterRemoveLiquidityReturnDelta: false,
        });
    }

    // ── beforeSwap: Modify fees
    function beforeSwap(
        address,                    // sender
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        uint24 fee = isHighVolatility ? HIGH_FEE : BASE_FEE;

        // Override pool dynamic fee (Requires setting fee = 0x800000 dynamic flag on pool init)
        return (
            BaseHook.beforeSwap.selector,
            BeforeSwapDeltaLibrary.ZERO_DELTA,
            fee | uint24(Hooks.OVERRIDE_FEE_FLAG)  // Override flag
        );
    }

    // External price oracle triggers volatility update
    function setHighVolatility(bool _high) external { isHighVolatility = _high; }
}
```

### Hook Deployment —�?Address Mining (Crucial!)

```
⚠️ V4 Hook Contract addresses MUST contain Hook permission bits:
   The lowest 14 bits of the address correspond to the 14 Hook trigger point on/off switches.
   PoolManager determines which Hook functions to call by checking the lowest bits of the address.

   beforeSwap = 7th bit (From right) �?Address lowest byte must have corresponding bit.

Tool: HookMiner (Official from Uniswap)
```

```typescript
// Mine a CREATE2 address that fulfills conditions using HookMiner
import { HookMiner } from '@uniswap/v4-periphery/out/HookMiner.sol/HookMiner.json';

// Calculate required flags (beforeSwap = true)
const flags = BigInt(Hooks.BEFORE_SWAP_FLAG);  // 0x0080

// Mine: Look for a salt that makes the CREATE2 address satisfy the flags
const [hookAddress, salt] = HookMiner.find(
    DEPLOYER_ADDRESS,
    flags,
    DynamicFeeHook.bytecode,
    abi.encode(POOL_MANAGER_ADDRESS)
);

// Deploy with the found salt
const hook = await new ethers.ContractFactory(abi, bytecode, signer)
    .deploy(POOL_MANAGER_ADDRESS, { salt });
```

### Creating a V4 Pool

```solidity
import { PoolKey }    from "@uniswap/v4-core/src/types/PoolKey.sol";
import { Currency }   from "@uniswap/v4-core/src/types/Currency.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";

// PoolManager Mainnet Address: 0x000000000004444c5dc75cB358380D2e3dE08A90
// Uniswap V4 stores all pools in a single PoolManager contract

PoolKey memory key = PoolKey({
    currency0: Currency.wrap(token0),  // Smaller address goes first
    currency1: Currency.wrap(token1),
    fee:       0x800000,               // Dynamic fee flag (Use Hook to override)
    tickSpacing: 60,                   // Corresponds to legacy 0.3% pool
    hooks:     IHooks(hookAddress),    // Our Hook contract
});

// Initialize pool (sqrtPriceX96 = �?price) × 2^96)
uint160 sqrtPriceX96 = 79228162514264337593543950336; // 1:1
poolManager.initialize(key, sqrtPriceX96);
```
