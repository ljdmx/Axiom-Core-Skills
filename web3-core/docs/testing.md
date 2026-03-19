# Smart Contract Testing Reference Manual

## Table of Contents
1. [Hardhat Testing](#1-hardhat-testing)
2. [Foundry Testing](#2-foundry-testing)
3. [Fuzz Testing](#3-fuzz-testing)
4. [Mainnet Forking](#4-mainnet-forking)

---

## 1. Hardhat Testing

```typescript
import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MyToken", function () {
    // ─── Fixture (Resets state before every test) ─────────────────────────
    async function deployTokenFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        
        const MyToken = await ethers.getContractFactory("MyToken");
        const token = await MyToken.deploy(
            "My Token", "MTK",
            owner.address,
            ethers.parseEther("1000000")
        );

        return { token, owner, user1, user2 };
    }

    // ─── Deployment Tests ─────────────────────────────────────────────
    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            const { token } = await loadFixture(deployTokenFixture);
            expect(await token.name()).to.equal("My Token");
            expect(await token.symbol()).to.equal("MTK");
        });

        it("Should assign initial supply to owner", async function () {
            const { token, owner } = await loadFixture(deployTokenFixture);
            const supply = ethers.parseEther("1000000");
            expect(await token.balanceOf(owner.address)).to.equal(supply);
        });
    });

    // ─── Transfer Tests ─────────────────────────────────────────────
    describe("Transfers", function () {
        it("Should transfer tokens between accounts", async function () {
            const { token, owner, user1 } = await loadFixture(deployTokenFixture);
            const amount = ethers.parseEther("100");
            
            await expect(token.transfer(user1.address, amount))
                .to.emit(token, "Transfer")
                .withArgs(owner.address, user1.address, amount);
            
            expect(await token.balanceOf(user1.address)).to.equal(amount);
        });

        it("Should fail if sender has insufficient balance", async function () {
            const { token, user1 } = await loadFixture(deployTokenFixture);
            
            await expect(
                token.connect(user1).transfer(user1.address, 1n)
            ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
        });
    });

    // ─── Time Manipulation Tests ──────────────────────────────────────────
    describe("Vesting", function () {
        it("Should not allow withdrawal before cliff", async function () {
            const { vesting, user1 } = await loadFixture(deployVestingFixture);
            await expect(vesting.connect(user1).claim()).to.be.revertedWith("Cliff not reached");
        });

        it("Should allow full withdrawal after vesting period", async function () {
            const { vesting, user1 } = await loadFixture(deployVestingFixture);
            
            // Fast forward time
            await time.increase(365 * 24 * 3600);  // 1 year
            
            await vesting.connect(user1).claim();
            expect(await token.balanceOf(user1.address)).to.equal(VESTED_AMOUNT);
        });
    });

    // ─── Profiling Tests ──────────────────────────────────────────────
    describe("Gas usage", function () {
        it("Transfer gas should be under 50000", async function () {
            const { token, owner, user1 } = await loadFixture(deployTokenFixture);
            const tx = await token.transfer(user1.address, 100n);
            const receipt = await tx.wait();
            expect(receipt!.gasUsed).to.be.lessThan(50000n);
        });
    });
});
```

---

## 2. Foundry Testing

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");

    // ─── Pre-test Initialization ─────────────────────────────────────────
    function setUp() public {
        vm.startPrank(owner);
        token = new MyToken("My Token", "MTK", owner, 1_000_000 ether);
        vm.stopPrank();
    }

    // ─── Basic Tests ─────────────────────────────────────────────
    function test_InitialSupply() public view {
        assertEq(token.balanceOf(owner), 1_000_000 ether);
        assertEq(token.totalSupply(), 1_000_000 ether);
    }

    function test_Transfer() public {
        vm.prank(owner);
        token.transfer(user1, 100 ether);
        
        assertEq(token.balanceOf(user1), 100 ether);
        assertEq(token.balanceOf(owner), 999_900 ether);
    }

    function test_RevertWhen_InsufficientBalance() public {
        vm.expectRevert();  // Or specific error: vm.expectRevert(IERC20Errors.ERC20InsufficientBalance.selector)
        vm.prank(user1);
        token.transfer(user2, 1 ether);
    }

    // ─── Time Manipulation ─────────────────────────────────────────────
    function test_StakingReward() public {
        // Skip 7 days
        skip(7 days);
        // Or set absolute timestamp
        vm.warp(block.timestamp + 7 days);
        
        // Skip N blocks
        vm.roll(block.number + 100);
    }

    // ─── ETH Balance Manipulation ─────────────────────────────────────────────
    function test_Withdraw() public {
        // Provide ETH balance
        vm.deal(user1, 1 ether);
        
        vm.prank(user1);
        contract_.deposit{value: 1 ether}();
        
        uint256 before = user1.balance;
        vm.prank(user1);
        contract_.withdraw();
        assertEq(user1.balance, before + 1 ether);
    }

    // ─── Event Assertions ─────────────────────────────────────────────
    function test_EmitsTransferEvent() public {
        vm.expectEmit(true, true, false, true);  // indexed1, indexed2, indexed3, data
        emit IERC20.Transfer(owner, user1, 100 ether);
        
        vm.prank(owner);
        token.transfer(user1, 100 ether);
    }

    // ─── Gas Profiling ─────────────────────────────────────────────
    function test_GasTransfer() public {
        vm.prank(owner);
        uint256 gasBefore = gasleft();
        token.transfer(user1, 100 ether);
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint("Gas used", gasUsed);
        assertLt(gasUsed, 50_000);
    }
}
```

---

## 3. Fuzz Testing

```solidity
contract FuzzTest is Test {
    MyToken token;
    
    function setUp() public { /* ... */ }

    // ─── Basic Fuzzing ────────────────────────────────────────────
    /// @dev forge test --fuzz-runs 10000
    function testFuzz_Transfer(address recipient, uint256 amount) public {
        // Filter out invalid inputs
        vm.assume(recipient != address(0));
        vm.assume(recipient != owner);
        vm.assume(amount > 0 && amount <= token.balanceOf(owner));
        
        vm.prank(owner);
        token.transfer(recipient, amount);
        assertEq(token.balanceOf(recipient), amount);
    }

    // ─── Bounded Fuzzing (More Efficient) ──────────────────────────────────
    function testFuzz_Bounded(uint256 amount) public {
        // Using bound() instead of vm.assume() avoids wasted iterations
        amount = bound(amount, 1, token.balanceOf(owner));
        
        vm.prank(owner);
        token.transfer(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    // ─── Invariant Testing ────────────────────────────────────────────────
    // Asserts that system properties hold true regardless of sequence
    function invariant_TotalSupplyNeverIncreases() public view {
        assertLe(token.totalSupply(), INITIAL_SUPPLY);
    }

    function invariant_SumOfBalancesEqualsSupply() public view {
        uint256 sum = token.balanceOf(owner) +
                      token.balanceOf(user1) +
                      token.balanceOf(user2);
        assertEq(sum, token.totalSupply());
    }
}
```

### Invariant Handler Pattern (Production-Grade State Testing)

Simple `invariant_xxx` functions allow Foundry to randomly call **all public functions** of the target contract. However, most randomized calls will immediately revert (e.g., transferring to zero address), leading to exceedingly inefficient test runs. The Handler pattern coerces Foundry through meaningful invocation paths via constrained sequencing.

```solidity
// test/handlers/TokenHandler.sol — Handler steering invocation logic
contract TokenHandler is Test {
    MyToken public token;

    // Tracker for all participating "Actors"
    address[] public actors;
    address   internal currentActor;

    // Ghost variables: Track handler-level cumulative states (For assertions)
    uint256 public ghost_mintedTotal;
    uint256 public ghost_burnedTotal;

    modifier useActor(uint256 actorSeed) {
        currentActor = actors[bound(actorSeed, 0, actors.length - 1)];
        vm.startPrank(currentActor);
        _;
        vm.stopPrank();
    }

    constructor(MyToken _token) {
        token = _token;
        // Seed fixed actor pool (Limits randomness space for quicker convergence)
        for (uint256 i = 0; i < 5; i++) {
            actors.push(makeAddr(string.concat("actor", vm.toString(i))));
        }
    }

    // ── Wrapper: transfer (Filtering unworkable inputs) ─────────────────
    function transfer(
        uint256 actorSeed,
        uint256 recipientSeed,
        uint256 amount
    ) external useActor(actorSeed) {
        address to = actors[bound(recipientSeed, 0, actors.length - 1)];
        amount = bound(amount, 0, token.balanceOf(currentActor));
        if (amount == 0) return;  // Bypass meaningless 0-transfers

        token.transfer(to, amount);
    }

    // ── Wrapper: mint ──────────────────────────────────────────────
    function mint(address to, uint256 amount) external {
        amount = bound(amount, 1, 1_000_000 ether);
        // Guarantee ceiling against MAX_SUPPLY
        uint256 remaining = token.MAX_SUPPLY() - token.totalSupply();
        amount = bound(amount, 0, remaining);
        if (amount == 0) return;

        vm.prank(token.owner());
        token.mint(to, amount);
        ghost_mintedTotal += amount;
    }

    // ── Wrapper: burn ──────────────────────────────────────────────
    function burn(uint256 actorSeed, uint256 amount) external useActor(actorSeed) {
        amount = bound(amount, 0, token.balanceOf(currentActor));
        if (amount == 0) return;

        token.burn(amount);
        ghost_burnedTotal += amount;
    }
}

// test/invariants/TokenInvariant.t.sol — Deployment of the Handler for Invariant runs
contract TokenInvariantTest is Test {
    MyToken       public token;
    TokenHandler  public handler;

    function setUp() public {
        token   = new MyToken("T", "T", address(this));
        handler = new TokenHandler(token);

        // ⚠️ VITAL: Direct Foundry to route solely through handler, skipping token contract
        targetContract(address(handler));

        // Exclude the token contract explicitly
        excludeContract(address(token));
    }

    // ── Invariant: totalSupply = mintedTotal - burnedTotal ───────
    function invariant_supplyAccountingCorrect() public view {
        assertEq(
            token.totalSupply(),
            handler.ghost_mintedTotal() - handler.ghost_burnedTotal(),
            "Supply accounting broken"
        );
    }

    // ── Invariant: totalSupply <= MAX_SUPPLY ─────────────────────
    function invariant_supplyNeverExceedsMax() public view {
        assertLe(token.totalSupply(), token.MAX_SUPPLY());
    }

    // ── Invariant: All singular balances <= totalSupply ───────────────────
    function invariant_noAddressExceedsSupply() public view {
        address[] memory actors = handler.getActors();
        for (uint256 i; i < actors.length;) {
            assertLe(token.balanceOf(actors[i]), token.totalSupply());
            unchecked { ++i; }
        }
    }

    // Output stats post-run completion
    function invariant_callSummary() public view {
        console.log("Minted:", handler.ghost_mintedTotal());
        console.log("Burned:", handler.ghost_burnedTotal());
    }
}
```

```toml
# foundry.toml — Invariant Test Options
[invariant]
runs           = 512    # Number of whole execution sequences
depth          = 500    # Operation depth per run
call_override  = false
fail_on_revert = false  # Reverts do not count as failures (Handler already filters)
```

```bash
# Execute invariant checks
forge test --match-contract Invariant -vvv

# In the event of an invariant break, Foundry yields the shortest path sequence:
# [FAIL] invariant_supplyAccountingCorrect()
#   Sequence:
#     handler.mint(0xabc, 1000)
#     handler.burn(0, 500)
#     ... (Shortest traversal)
```

**foundry.toml Fuzz Configurations:**
```toml
[fuzz]
runs = 10000
seed = "0x1"
max_test_rejects = 65536

[invariant]
runs = 512
depth = 500  # Number of depth calls per run
```


---

## 4. Mainnet Forking

### Hardhat Forking
```typescript
// hardhat.config.ts
networks: {
    hardhat: {
        forking: {
            url: process.env.MAINNET_RPC_URL!,
            blockNumber: 19000000,  // Pin block for determinism
        }
    }
}

// Hooking into native mainnet deployments within tests
it("Should interact with real Uniswap", async function () {
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    
    // Impersonate WETH whale account
    const whale = "0x2f0b23f53734252Bda2277357e97e1517d6B042A";
    await ethers.provider.send("hardhat_impersonateAccount", [whale]);
    const whaleSigner = await ethers.getSigner(whale);
    
    // Proceed test against real Uniswap protocol instances...
});
```

### Foundry Forking
```solidity
contract ForkTest is Test {
    string MAINNET_RPC = vm.envString("MAINNET_RPC_URL");
    uint256 FORK_BLOCK = 19_000_000;
    
    function setUp() public {
        // Init fork environment
        uint256 forkId = vm.createSelectFork(MAINNET_RPC, FORK_BLOCK);
    }

    function test_UniswapV3Swap() public {
        address USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        address WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        
        // Populate local balances
        deal(WETH, address(this), 1 ether);
        
        // Impersonate actual actors
        address whale = 0x2f0b23f53734252Bda2277357e97e1517d6B042A;
        vm.startPrank(whale);
        
        // Directly route to existing Uniswap contracts
        ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(...);
        
        vm.stopPrank();
    }
}
```

---

## Test Command Cheatsheet

```bash
# Hardhat
npx hardhat test                           # Execute suite
npx hardhat test --grep "Transfer"         # Grep for targeted executions
npx hardhat coverage                       # Coverage profiling
npx hardhat gas                            # Gas instrumentation reports

# Foundry
forge test                                 # Execute suite
forge test -vvvv                           # Ultimate verbosity (Stack traces inline)
forge test --match-test testFuzz           # Fuzz subsets isolated
forge test --match-contract TokenTest      # Contract subsets isolated
forge coverage                             # Coverage overview
forge snapshot                             # Dump gas delta
forge test --fork-url $MAINNET_RPC         # Fork environment execution target
```

---

## 5. Mocking Contracts & vm.mockCall

```solidity
// Foundry: Eliminates necessity for dedicated Mock classes; bypass responses anywhere

contract MockTest is Test {
    address constant CHAINLINK_FEED = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

    function test_MockOracle() public {
        // Enforce Chainlink return value indicating $2000 ETH
        vm.mockCall(
            CHAINLINK_FEED,
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(
                uint80(1),         // roundId
                int256(2000e8),    // answer (8 decimals)
                uint256(0),        // startedAt
                uint256(block.timestamp), // updatedAt
                uint80(1)          // answeredInRound
            )
        );

        // Contracts probing Chainlink hereforth receive hijacked responses
        uint256 price = myContract.getETHPrice();
        assertEq(price, 2000e8);

        // Terminate override
        vm.clearMockedCalls();
    }

    // Emulate ERC-20 transfer fault response
    function test_HandleTransferFailure() public {
        vm.mockCall(
            TOKEN_ADDRESS,
            abi.encodeWithSelector(IERC20.transfer.selector, recipient, amount),
            abi.encode(false)  // Yield false constraint block
        );
        vm.expectRevert();
        myContract.withdraw(amount);
    }

    // Force failure throw routines
    function test_OracleReverts() public {
        vm.mockCallRevert(
            CHAINLINK_FEED,
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encodeWithSignature("Error(string)", "No data")
        );
        vm.expectRevert();
        myContract.getETHPrice();
    }
}
```

---

## 6. Gas Snapshots Workflow

```bash
# Snapshot fundamental baseline
forge snapshot
# Produces .gas-snapshot mapping; push cleanly via git commit

# Review impact after later alterations
forge snapshot --diff
# Trace Output Example:
# test_Transfer() (gas: -1234 (-5.2%))  ← Positive Optimizations ! ✅
# test_Mint()     (gas: +567  (+2.1%))  ← Expansion of Load! ⚠️

# Hard checks integrated into CI routines (Breaks build upon deviation increases)
forge snapshot --check
# Aborts pipeline if overhead balloons passed thresholds

# Isolated reviews
forge snapshot --match-test testTransfer --diff

# Detailed tabular printout
forge test --gas-report 2>&1 | tee gas-report.txt
```

**Gas Snapshot Best Practices:**
```
1. Version Control `.gas-snapshot` files within the git repo.
2. Bind `forge snapshot --check` inside CI gates ensuring runaway consumption arrests.
3. Call `forge snapshot --diff` prior to raising PRs in pursuit of metric tracking comments.
4. Execute raw snapshot resets following architectural upgrades rendering previous bounds moot.
```
