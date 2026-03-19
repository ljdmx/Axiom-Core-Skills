# Solidity Contract Templates (OZ v5 Production-Grade)

## Table of Contents
1. [ERC-20 Token (With Permit)](#1-erc-20)
2. [ERC-20 Staking Rewards (Synthetix Pattern)](#2-staking-rewards)
3. [ERC-721 NFT (With Royalties)](#3-erc-721)
4. [ERC-1155 Multi-Token](#4-erc-1155)
5. [ERC-4626 Tokenized Vault](#5-erc-4626)
6. [Multi-sig (Safe Style)](#6-multi-sig)

> Note: For contract baseline rules (CEI / storage layout / Gas optimization) see `references/solidity-core.md`.

---

## 1. ERC-20

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

// ── Errors ────────────────────────────────────────────────────────
error ExceedsMaxSupply(uint256 requested, uint256 remaining);
error ZeroAddress();

/// @title MyToken — ERC-20 + EIP-2612 Permit + Ownable2Step
contract MyToken is ERC20, ERC20Burnable, ERC20Permit, Ownable2Step {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    event TokensMinted(address indexed to, uint256 amount);

    constructor(string memory name, string memory symbol, address owner)
        ERC20(name, symbol)
        ERC20Permit(name)
        Ownable(owner)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        uint256 remaining = MAX_SUPPLY - totalSupply();
        if (amount > remaining) revert ExceedsMaxSupply(amount, remaining);
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}
```

---

## 2. Staking Rewards

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// Synthetix StakingRewards Minimal Implementation
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingRewards is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    uint256 public duration    = 7 days;
    uint256 public finishAt;
    uint256 public updatedAt;
    uint256 public rewardRate;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    error AmountZero();
    error RewardDurationNotFinished();
    error RewardRateZero();
    error InsufficientRewardBalance();
    error RewardPeriodActive();   // Reward period active; duration cannot be modified

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        updatedAt = _min(finishAt, block.timestamp);
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    constructor(address _staking, address _rewards, address _owner)
        Ownable(_owner)
    {
        stakingToken = IERC20(_staking);
        rewardsToken = IERC20(_rewards);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored +
            rewardRate * (_min(finishAt, block.timestamp) - updatedAt) * 1e18 / totalSupply;
    }

    function earned(address account) public view returns (uint256) {
        return balanceOf[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18
            + rewards[account];
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert AmountZero();
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
    }

    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert AmountZero();
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
        }
    }

    function notifyRewardAmount(uint256 amount) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= finishAt) {
            rewardRate = amount / duration;
        } else {
            rewardRate = (amount + (finishAt - block.timestamp) * rewardRate) / duration;
        }
        if (rewardRate == 0) revert RewardRateZero();
        if (rewardRate * duration > rewardsToken.balanceOf(address(this)))
            revert InsufficientRewardBalance();
        finishAt  = block.timestamp + duration;
        updatedAt = block.timestamp;
    }

    function setDuration(uint256 _duration) external onlyOwner {
        if (block.timestamp < finishAt) revert RewardPeriodActive();
        duration = _duration;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) { return a < b ? a : b; }
}
```

---

## 3. ERC-721

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// OpenZeppelin v5

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error SaleNotActive();
error ExceedsSupply();
error ExceedsWalletLimit();
error InsufficientPayment();
error WithdrawFailed();
error InvalidProof();

contract MyNFT is ERC721, ERC721Royalty, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY   = 10_000;
    uint256 public constant MINT_PRICE   = 0.05 ether;
    uint256 public constant WL_PRICE     = 0.03 ether;
    uint256 public constant MAX_PER_WALLET = 5;

    uint256 private _nextTokenId = 1;     // Start from index 1
    string  private _baseTokenURI;
    string  public  unrevealedURI;
    bool    public  revealed;
    bytes32 public  merkleRoot;

    enum Phase { Closed, Whitelist, Public }
    Phase public phase;

    mapping(address => uint256) public minted;

    constructor(address owner, address royaltyReceiver, string memory _unrevealedURI)
        ERC721("MyNFT", "MNFT")
        Ownable(owner)
    {
        _setDefaultRoyalty(royaltyReceiver, 500); // 5% (500 bps)
        unrevealedURI = _unrevealedURI;
    }

    // ─── Whitelist Mint ──────────────────────────────────────────
    function whitelistMint(uint256 qty, bytes32[] calldata proof) external payable {
        if (phase != Phase.Whitelist)                   revert SaleNotActive();
        if (_nextTokenId + qty - 1 > MAX_SUPPLY)        revert ExceedsSupply();
        if (minted[msg.sender] + qty > MAX_PER_WALLET)  revert ExceedsWalletLimit();
        if (msg.value < WL_PRICE * qty)                 revert InsufficientPayment();

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender))));
        if (!MerkleProof.verify(proof, merkleRoot, leaf)) revert InvalidProof();

        minted[msg.sender] += qty;
        for (uint256 i; i < qty;) { _mint(msg.sender, _nextTokenId++); unchecked { ++i; } }
    }

    // ─── Public Mint ────────────────────────────────────────────
    function publicMint(uint256 qty) external payable {
        if (phase != Phase.Public)                       revert SaleNotActive();
        if (_nextTokenId + qty - 1 > MAX_SUPPLY)         revert ExceedsSupply();
        if (minted[msg.sender] + qty > MAX_PER_WALLET)   revert ExceedsWalletLimit();
        if (msg.value < MINT_PRICE * qty)                revert InsufficientPayment();

        minted[msg.sender] += qty;
        for (uint256 i; i < qty;) { _mint(msg.sender, _nextTokenId++); unchecked { ++i; } }
    }

    // ─── URI ─────────────────────────────────────────────────
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (!revealed) return unrevealedURI;
        return string.concat(_baseTokenURI, tokenId.toString(), ".json");
    }

    // ─── Owner Controls ───────────────────────────────────────────
    function reveal(string calldata uri) external onlyOwner { _baseTokenURI = uri; revealed = true; }
    function setPhase(Phase _p) external onlyOwner { phase = _p; }
    function setMerkleRoot(bytes32 r) external onlyOwner { merkleRoot = r; }
    function airdrop(address[] calldata tos) external onlyOwner {
        uint256 len = tos.length;
        if (_nextTokenId + len - 1 > MAX_SUPPLY) revert ExceedsSupply();
        for (uint256 i; i < len;) { _mint(tos[i], _nextTokenId++); unchecked { ++i; } }
    }
    function withdraw() external onlyOwner {
        (bool ok,) = msg.sender.call{value: address(this).balance}("");
        if (!ok) revert WithdrawFailed();
    }

    // ─── Interfaces ─────────────────────────────────────────────────
    function supportsInterface(bytes4 id) public view override(ERC721, ERC721Royalty) returns (bool) {
        return super.supportsInterface(id);
    }
}
```

---

## 4. ERC-1155

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GameItems is ERC1155, ERC1155Supply, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token IDs
    uint256 public constant GOLD   = 0;  // Fungible
    uint256 public constant SWORD  = 1;  // NFT
    uint256 public constant POTION = 2;  // Stackable

    mapping(uint256 => uint256) public maxSupply;

    constructor(address admin) ERC1155("https://api.game.com/tokens/{id}.json") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        maxSupply[SWORD] = 1_000;
    }

    function mint(address to, uint256 id, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (maxSupply[id] > 0)
            require(totalSupply(id) + amount <= maxSupply[id], "Exceeds max");
        _mint(to, id, amount, "");
    }

    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts)
        external onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, "");
    }

    function supportsInterface(bytes4 id) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(id);
    }
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal override(ERC1155, ERC1155Supply)
    { super._update(from, to, ids, values); }
}
```

---

## 5. ERC-4626 Tokenized Vault

ERC-4626 is the de facto standard for yield-bearing vaults within DeFi; recognized and harnessed by implementations such as Aave, Yearn v3, and Morpho.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SimpleVault — Standardized ERC-4626 Vault
/// Deposit USDC → Acquire vUSDC (Share token) → Redeem shares proportionally against the asset backing later
contract SimpleVault is ERC4626, Ownable {
    uint256 public totalYield;  // Cumulative tracking (Written by strategy contract)

    constructor(IERC20 _asset, address _owner)
        ERC4626(_asset)
        ERC20("Vault USDC", "vUSDC")
        Ownable(_owner)
    {}

    /// @notice Strategy routing report to push pricePerShare up
    function reportYield(uint256 yield) external onlyOwner {
        totalYield += yield;
        // Production logic usually involves injecting asset funds into the ledger locally
        // IERC20(asset()).transferFrom(strategy, address(this), yield);
    }

    /// @notice Global asset = Contract balance (Default OpenZeppelin hook)
    /// Overriding this establishes bindings to external entities (e.g., Aave aToken balances)
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }

    // Core ERC-4626 Functions (Autogenerated via OZ scaffolding, manually rewriting unnecessary):
    // deposit(assets, receiver)    → Supplies asset, mints shares
    // mint(shares, receiver)       → Identifies asset burden to yield target shares
    // withdraw(assets, receiver, owner) → Burns shares, transfers matching asset valuation out
    // redeem(shares, receiver, owner)   → Claims exact asset quantity equivalent against the provided shares parameter
    // convertToShares(assets)      → Asset → Shares valuation mapping
    // convertToAssets(shares)      → Shares → Asset mapping projection
    // previewDeposit/Withdraw/...  → Evaluates consequence without transactional state mutations
}

// ── ERC-4626 implementation fused to Aave aTokens ────────────────────────────
contract AaveVault is ERC4626 {
    IPool public immutable aavePool;
    address public immutable aToken;

    constructor(IERC20 _underlying, IPool _pool, address _aToken)
        ERC4626(_underlying)
        ERC20("Aave Yield Vault", "ayvUSDC")
    {
        aavePool = _pool;
        aToken   = _aToken;
    }

    function totalAssets() public view override returns (uint256) {
        return IERC20(aToken).balanceOf(address(this));  // Automagic interest scaling inherently evaluated
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares)
        internal override
    {
        IERC20(asset()).transferFrom(caller, address(this), assets);
        IERC20(asset()).approve(address(aavePool), assets);
        aavePool.supply(asset(), assets, address(this), 0);  // Push to Aave
        _mint(receiver, shares);
    }

    function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares)
        internal override
    {
        if (caller != owner) _spendAllowance(owner, caller, shares);
        _burn(owner, shares);
        aavePool.withdraw(asset(), assets, receiver);  // Yank from Aave 
    }
}
```

---

## 6. Multi-sig

Within production environments, coding proprietary multi-sig contracts presents exceptionally high avenues for risk. **Under all circumstances, Gnosis Safe should be used natively.** Hand-rolling consensus validations is universally frowned upon.

> Full Safe SDK integration specs (Creating Safes / Propositions / Threshold confirmations / Execution pathways) natively housed in `references/defi.md §6`

```
Safe Configuration Targets:
  Safe{Wallet}  — Baseline Multi-sig (M/N consensus). Preferred production layer.
  Safe AA       — Account Abstraction version; provides batch gasless operational flow.
  Safe{Core}    — Protocol-level SDK routing (Embedding into independent UI shells).

Primary Routing Signifiers (Identical across all EVM Chains, v1.4.1 deployment target):
  Safe Singleton:  0x41675C099F32341bf84BFc5382aF534df5C7461a
  ProxyFactory:    0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67
```
