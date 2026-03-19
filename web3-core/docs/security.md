# Web3 Security Audit Reference Manual

## Table of Contents
1. [Reentrancy Attacks](#1-reentrancy-attacks)
2. [Access Control Vulnerabilities](#2-access-control-vulnerabilities)
3. [Arithmetic Issues](#3-arithmetic-issues)
4. [Oracle Manipulation](#4-oracle-manipulation)
5. [Flash Loan Attacks](#5-flash-loan-attacks)
6. [Front-Running](#6-front-running)
7. [Signature Vulnerabilities](#7-signature-vulnerabilities)
8. [Common Secure Patterns](#8-common-secure-patterns)
9. [Audit Tooling](#9-audit-tooling)

---

## 1. Reentrancy Attacks

### Vulnerability Example
```solidity
// ❌ DANGEROUS — Transfers value before mutating state
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);
    (bool ok,) = msg.sender.call{value: amount}("");  // Attacker reenters here!
    require(ok);
    balances[msg.sender] -= amount;  // State update happens too late!
}
```

### Remediation
```solidity
// ✅ Pattern 1: CEI Pattern (Checks-Effects-Interactions)
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);  // Checks
    balances[msg.sender] -= amount;            // Effects (Mutate state FIRST!)
    (bool ok,) = msg.sender.call{value: amount}(""); // Interactions
    require(ok);
}

// ✅ Pattern 2: ReentrancyGuard (Safest)
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok);
}

// ✅ Pattern 3: Transient Storage Lock (Solidity 0.8.24, EIP-1153)
// Lock remains during the same Tx, cheaper than traditional storage
bool transient locked;
modifier noReentrant() {
    require(!locked);
    locked = true;
    _;
    locked = false;
}
```

### Cross-Function Reentrancy
```solidity
// ❌ DANGEROUS — Cross-function Reentrancy
mapping(address => uint256) public balances;

function deposit() external payable { balances[msg.sender] += msg.value; }

function withdraw() external {
    (bool ok,) = msg.sender.call{value: balances[msg.sender]}("");
    // Attacker calls deposit() inside the fallback function before returning, inflating balance!
    balances[msg.sender] = 0;
}

// ✅ Remediation: nonReentrant used across all susceptible state changes
```

---

## 2. Access Control Vulnerabilities

```solidity
// ❌ DANGEROUS — Anyone can call initialize
function initialize(address owner) public {
    admin = owner;
}

// ✅ Remediation — Initialized only once
bool private initialized;
function initialize(address owner) public {
    require(!initialized, "Already initialized");
    initialized = true;
    admin = owner;
}
// Best Practice: OpenZeppelin Initializable Pattern

// ❌ DANGEROUS — tx.origin for authentication (Susceptible to phishing contracts)
function adminAction() external {
    require(tx.origin == admin, "Not admin");  // Hazardous!
}

// ✅ Remediation
function adminAction() external {
    require(msg.sender == admin, "Not admin");
}
```

---

## 3. Arithmetic Issues

```solidity
// Solidity 0.8+ natively protects against overflow/underflows, 
// though manual verification is required in 'unchecked' blocks

// ❌ DANGEROUS — Underflow possible inside unchecked block 
unchecked {
    balances[msg.sender] -= amount;  // If amount > balance, it underflows to MAX_INT
}

// ✅ Remediation
if (balances[msg.sender] < amount) revert InsufficientBalance();
unchecked { balances[msg.sender] -= amount; }  // Only safe here!

// ❌ DANGEROUS — Precision loss (Division before multiplication)
uint256 reward = totalReward / totalSupply * userBalance;  // Prevents truncation!

// ✅ Remediation (Multiply before dividing)
uint256 reward = totalReward * userBalance / totalSupply;

// ❌ DANGEROUS — Timestamp can be slightly manipulated by miners (~15 secs)
require(block.timestamp > deadline + 15 seconds);  // Small bounds are unreliable!
```

---

## 4. Oracle Manipulation

```solidity
// ❌ DANGEROUS — Utilizing AMM spot price directly as Oracle
function getPrice(address token) internal view returns (uint256) {
    // Attackers use flash loans to skew the AMM ratio, returning manipulated data
    (uint112 r0, uint112 r1,) = IUniswapV2Pair(pair).getReserves();
    return uint256(r1) * 1e18 / uint256(r0);
}

// ✅ Pattern 1: Chainlink Price Oracles
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

function getChainlinkPrice(address feed) internal view returns (uint256) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);
    (, int256 price,, uint256 updatedAt,) = priceFeed.latestRoundData();
    require(block.timestamp - updatedAt < 1 hours, "Stale price");
    require(price > 0, "Invalid price");
    return uint256(price);
}

// ✅ Pattern 2: Uniswap V3 TWAP (Time-Weighted Average Price)
function getTWAP(address pool, uint32 twapInterval)
    internal view returns (uint256 price)
{
    uint32[] memory secondsAgos = new uint32[](2);
    secondsAgos[0] = twapInterval;
    secondsAgos[1] = 0;
    (int56[] memory tickCumulatives,) =
        IUniswapV3Pool(pool).observe(secondsAgos);
    int56 tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];
    int24 tick = int24(tickCumulativesDelta / int32(twapInterval));
    price = TickMath.getSqrtRatioAtTick(tick);
}
```

---

## 5. Flash Loan Attacks

```solidity
// ❌ DANGEROUS — Reliance on balance values inside exactly 1 block
function calculateReward() external {
    // Attacker Flash Loans massive tokens → Executes here → Repays immediately
    uint256 share = token.balanceOf(msg.sender) * 1e18 / token.totalSupply();
    rewards[msg.sender] = share * totalRewards / 1e18;
}

// ✅ Remediation — Historical snapshots. TWAB (Time-Weighted Balances)
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

// Alternatively: Enforce invariant checks pre & post ops
uint256 before = token.balanceOf(address(this));
// ... operation ...
require(token.balanceOf(address(this)) >= before, "Flash loan detected");

// ✅ Better: Employ block-height checks on deposits/withdrawals
mapping(address => uint256) public depositBlock;
function deposit(uint256 amount) external {
    depositBlock[msg.sender] = block.number;
    // ...
}
function withdraw() external {
    require(block.number > depositBlock[msg.sender], "Same block");
    // ...
}
```

---

## 6. Front-Running

```solidity
// ❌ DANGEROUS — Highly susceptible to MEV sandwich bots
function buyToken(uint256 price) external payable {
    // Bots observe your tx & outbid it with higher gwei priority
}

// ✅ Pattern 1: Commit-Reveal Paradigm
mapping(address => bytes32) public commitments;

function commit(bytes32 hash) external {
    commitments[msg.sender] = hash;
}

function reveal(uint256 price, bytes32 salt) external {
    bytes32 hash = keccak256(abi.encodePacked(price, salt, msg.sender));
    require(commitments[msg.sender] == hash, "Invalid commitment");
    delete commitments[msg.sender];
    // Proceed operation ...
}

// ✅ Pattern 2: Slippage tolerance controls (crucial in AMMs)
function swap(uint256 amountIn, uint256 minAmountOut) external {
    uint256 amountOut = getAmountOut(amountIn);
    require(amountOut >= minAmountOut, "Slippage too high");
    // ...
}

// ✅ Pattern 3: RPC level (Flashbots private RPC routing)
```

---

## 7. Signature Vulnerabilities

```solidity
// ❌ DANGEROUS — Signature replay attacks (Lacking nonce/chainId constraints)
function executeWithSig(address to, uint256 amount, bytes memory sig) external {
    bytes32 hash = keccak256(abi.encodePacked(to, amount));
    address signer = ECDSA.recover(hash, sig);  // Can be repeated unconditionally entirely valid!
    // ...
}

// ✅ Remediation — Standardized EIP-712 structured sigs
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SecurePermit is EIP712 {
    mapping(address => uint256) public nonces;
    
    bytes32 private constant PERMIT_TYPEHASH = keccak256(
        "Permit(address to,uint256 amount,uint256 nonce,uint256 deadline)"
    );

    constructor() EIP712("MyContract", "1") {}

    function executeWithSig(
        address to, uint256 amount,
        uint256 deadline, bytes memory sig
    ) external {
        require(block.timestamp <= deadline, "Expired");
        
        bytes32 structHash = keccak256(abi.encode(
            PERMIT_TYPEHASH, to, amount, nonces[msg.sender]++, deadline
        ));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, sig);
        require(signer == msg.sender, "Invalid signature");
        // Proceed operations...
    }
}
```

---

## 8. Common Secure Patterns

### Pull Payment Pattern
```solidity
// ❌ PUSH mechanics — High likelihood of failure leading to total cascade
for (uint i = 0; i < winners.length; i++) {
    payable(winners[i]).transfer(prize);  // One bad fallback throws entire tx out!
}

// ✅ PULL Payments 
mapping(address => uint256) public pendingWithdrawals;

function claimPrize() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0);
    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
```

### Emergency Stop (Circuit Breakers)
```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyProtocol is Pausable, Ownable {
    function deposit() external whenNotPaused { /*...*/ }
    function withdraw() external { /*...*/ }  // Leave withdrawals open during pause
    
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
```

---

## 9. Audit Tooling

```bash
# Slither — Static compilation analyzer (De-facto industry standard)
pip install slither-analyzer
slither . --print human-summary
slither . --detect reentrancy-eth,unchecked-transfer

# Echidna — Fuzzing utility
docker pull trailofbits/eth-security-toolbox
echidna-test contracts/MyContract.sol --contract MyContract

# Foundry Fuzz Testing (Fuzz runs inherent)
function testFuzz_withdraw(uint256 amount) public {
    vm.assume(amount > 0 && amount <= MAX);
    // ...
}
forge test --fuzz-runs 10000

# Mythril — Symbolic Execution environment
myth analyze contracts/MyContract.sol

# Auditing checklist archives
# https://solodit.xyz — Aggregated past audits from top firms
# https://swcregistry.io — Detailed CWE-like catalogue of exploits
```

---

## 10. Hall of Fame Exploits 

Deep analysis on historical hacks offers unmatched insights. 

### The DAO Hack (2016, ~$60M)
**Class:** Reentrancy  
**Cause:** The contract shifted Ether natively prior to updating user balances via fallback calls inside the recursive loop structure.  
**Lesson:** Checks-Effects-Interactions (CEI) became the standard design philosophy. See: `security.md §1`

### Poly Network (2021, $611M)
**Class:** Cross-chain Access Privileges  
**Cause:** Poor validation checks in `putCurEpochConPubKeyBytes` allowed any signer to freely alter routing logic keys.   
**Lesson:** Complete structural vetting regarding origin assertions is pivotal for bridge security.

### Cream Finance (2021, $130M)
**Class:** Flash Loan / Price Manipulation  
**Cause:** Leverage flash loans skewed AMP market depth while simultaneously re-entering the platform logic via ERC-777 callbacks.   
**Lesson:** Strictly decouple collateral valuation operations away from the block they reside in. Beware of generic ERC-777 inclusions. 

### Nomad Bridge (2022, $190M)
**Class:** Uninitialized parameter vulnerability (Copy-cat)  
**Cause:** The `committedRoot` was left entirely zeroed post-upgrade (`0x0`); enabling any invalid claim to clear automatically. Millions of individual bot addresses recreated identical exploits in realtime.   
**Lesson:** Extremely stringent validation steps upon deployment overrides.

### Euler Finance (2023, $197M)
**Class:** Core Flow Logistics (Donation Attack)  
**Cause:** `donateToReserves` permitted non-correlated token burning outside of collateral integrity monitoring checks.   
**Lesson:** All changes to global accounting ledgers must fundamentally clear overarching health limits prior to execution conclusion.

### Vulnerability Tier Ratings

| Severity | Type | Indicator |
|------|------|---------|
| **Critical** | Reentrancy (ETH/ERC-777) | Withdrawal operations lacking CEI |
| **Critical** | Privilege Escalations | Global-state functions missing admin constraints |
| **Critical** | Price Oracle Skewing | Trusting instantaneous spot evaluations |
| **Critical** | Integral Corruptions | Missing boundaries in `unchecked` arithmetic code |
| **High** | Flash Loans Constraints | Exploits within atomic lifecycle frames |
| **High** | Verification Replays | Total lack of nonce/chain identities on execution structs |
| **High** | PRNG Frailties | Harnessing `block.prevrandao` inappropriately |
| **Medium** | Execution DoS | Vast, unfiltered array parsing loop operations |
| **Medium** | Front-Running Arbitrage | Vulnerable token distributions failing slippage protocols |
| **Low** | Log Silences | Important contract mutations left unlogged |
| **Low** | Division Underloss | Improper numerical arrangements truncating minor data |
