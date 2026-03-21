# Solidity Core Reference (v0.8.24 / OZ v5)

## Table of Contents
1. [Version Selection](#1-version-selection)
2. [Storage Layout & Slot Packing](#2-storage-layout--slot-packing)
3. [Data Locations (calldata / memory / storage)](#3-data-locations)
4. [Contract Structure Convention (CEI Pattern)](#4-contract-structure-convention)
5. [Custom Errors & Events](#5-custom-errors--events)
6. [Gas Optimization Cheat Sheet](#6-gas-optimization-cheat-sheet)
7. [Access Control Patterns](#7-access-control-patterns)
8. [Upgradeable Contracts (UUPS)](#8-upgradeable-contracts-uups)

---

## 1. Version Selection

```
Key Solidity Version Milestones:
0.8.0   —SafeMath is built-in; OpenZeppelin SafeMath no longer needed
0.8.4   —Custom errors introduced (Lower Gas than require with string)
0.8.17  —viaIR optimization became mature
0.8.20  —PUSH0 opcode (Note: Not supported by zkSync, downgrade to 0.8.19 for L2s)
0.8.24  —Transient Storage (EIP-1153), Recommended for production

Recommended:            pragma solidity ^0.8.24;
L2 Compatible (zkSync): pragma solidity ^0.8.19;
```

---

## 2. Storage Layout & Slot Packing

Each Slot is 32 bytes. **Packing variables saves SLOAD/SSTORE Gas (Among the most expensive operations)**.

```solidity
contract StorageLayout {
    // ✅Packing Example: owner(20B) + paused(1B) + fee(8B) = 29B → Share Slot 0
    address public owner;    // 20 bytes
    bool    public paused;   //  1 byte  → Same slot as owner
    uint64  public fee;      //  8 bytes → Same slot, saves 2 SLOADs

    // ✅Slot 1: uint128(16B) + uint128(16B) = 32B
    uint128 public reserveA;
    uint128 public reserveB;

    // ❌Anti-pattern: uint8 taking up an entire Slot (More expensive than uint256!)
    uint256 public counter; // ✅Use uint256 if occupying a full slot
    uint8   public flag;    // ❌Standing alone, wastes space and gas

    // Dynamic Arrays: Slot N stores length, data starts at keccak256(N)
    uint256[] public arr;

    // Mapping: Slot M acts as a base, value is at keccak256(key —M)
    mapping(address => uint256) public balances;

    // Upgradeable contracts MUST reserve a storage gap
    uint256[50] private __gap;
}
```

**Reading storage (Debugging):**
```bash
cast storage <ADDR> 0 --rpc-url $RPC   # Slot 0
cast storage <ADDR> 1 --rpc-url $RPC   # Slot 1
```

---

## 3. Data Locations

```solidity
// calldata —Read-only, unmodifiable, cheapest Gas (First choice for external args)
function process(uint256[] calldata input) external pure { ... }

// memory  —Writable, temporary within function, medium Gas
function compute(string memory name) public pure returns (bytes32) {
    return keccak256(bytes(name));
}

// storage —Persistent, most expensive; cache to memory before loops
function sum() external view returns (uint256 total) {
    uint256[] memory local = arr;   // Load everything in one SLOAD
    uint256 len = local.length;     // Cache length
    for (uint256 i; i < len;) {
        total += local[i];
        unchecked { ++i; }          // Use unchecked to save Gas when safe
    }
}
```

---

## 4. Contract Structure Convention

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ① Import Order: External Libs → Internal Interfaces → Internal Contracts
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IMyProtocol.sol";

// ① Custom Errors (File-level, lower Gas than require + string)
error InsufficientBalance(uint256 available, uint256 required);
error Unauthorized(address caller);
error ZeroAddress();

// ① Interfaces (If any)
// interface IMyProtocol { ... }

// ① Main Contract
contract MyContract is ReentrancyGuard {
    // Constants (Evaluated at compile-time, zero storage overhead)
    uint256 public constant VERSION = 1;

    // Immutables (Evaluated at deployment, saves SLOAD)
    address public immutable factory;

    // State Variables (Packed by slot)
    address public owner;
    uint96  public fee;       // Shares Slot with owner

    // Events
    event FeeUpdated(uint96 oldFee, uint96 newFee);

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized(msg.sender);
        _;
    }

    // Function Order: constructor → receive → fallback → external → public → internal → private → view
    constructor(address _factory, address _owner, uint96 _fee) {
        if (_factory == address(0) || _owner == address(0)) revert ZeroAddress();
        factory = _factory;
        owner = _owner;
        fee = _fee;
    }

    receive() external payable {}

    // CEI Pattern: Checks → Effects → Interactions
    function withdraw(uint256 amount) external nonReentrant {
        if (balances[msg.sender] < amount)                       // Checks
            revert InsufficientBalance(balances[msg.sender], amount);

        balances[msg.sender] -= amount;                          // Effects

        (bool ok,) = msg.sender.call{value: amount}("");         // Interactions
        require(ok, "ETH transfer failed");
    }

    mapping(address => uint256) public balances;
}
```

---

## 5. Custom Errors & Events

```solidity
// ✅Custom Errors (Saves ~50% Gas compared to require with string)
error InsufficientBalance(uint256 have, uint256 need);
error Deadline(uint256 deadline, uint256 current);

// Usage
if (balance < amount) revert InsufficientBalance(balance, amount);
if (block.timestamp > deadline) revert Deadline(deadline, block.timestamp);

// ✅Event Design Principles
// indexed: Allow off-chain filtering/querying (Max 3)
// non-indexed: For reading values directly
event Transfer(
    address indexed from,    // → Iterable/Filterable
    address indexed to,      // → Iterable/Filterable
    uint256 value            // Values don't need indexed
);

// ✅Anonymous Events (Slightly cheaper Gas, but cannot be filtered by name)
event DataStored(bytes32 indexed key, bytes value) anonymous;
```

---

## 6. Gas Optimization Cheat Sheet

| Operation | Gas Cost | Optimization Tip |
|-----------|----------|-----------------|
| `SSTORE` (Cold) | 22,100 | Batch updates to reduce write frequency |
| `SLOAD` (Cold) | 2,100 | Cache in `memory`, read only once |
| `MLOAD/MSTORE` | 3 | Far cheaper than storage |
| `require(cond, "str")` | High | Swap to `revert CustomError()` |
| Loop `arr.length` | SLOAD per loop | Cache `uint len = arr.length;` |
| `uint8` (Solo slot) | Same as uint256 | Pack it, or use uint256 |
| `++i` vs `i++` | Differs by 3 gas | Use `++i` (no temp var allocated) |
| `string` state var | Expensive | Use `bytes32` if short/known length |
| `transfer()`/`send()` | 2300 gas limit | Use `.call{value:x}("")` for robust delivery |

### constant vs immutable vs storage

```solidity
// ── constant: Compile-time certainty, inlined in bytecode, ZERO gas ──────────────
uint256 public constant MAX_SUPPLY = 10_000;    // Gas: 0 (Inlined)
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

// ── immutable: Deployment certainty, stored in bytecode, WARM read=100gas ────────
address public immutable factory;     // ~20x cheaper than storage
uint256 public immutable deployTime;  // Assigned only in constructor
constructor(address _factory) {
    factory    = _factory;            // ✅Assignment only permitted here
    deployTime = block.timestamp;
}

// ── storage: Run-time mutability, SLOAD Cold=2100, Warm=100 gas ─────────────
address public owner;                 // Incurs SLOAD payload

// Selection Guide:
// Value never changes             → constant (Cheapest)
// Value set to param at runtime once → immutable (~20x cheaper than storage)
// Ongoing alterations             → storage (Most expensive, use sparingly)
```

```solidity
// ✅Batch Operations to save loop overhead
function batchMint(address[] calldata tos, uint256[] calldata amounts) external {
    uint256 len = tos.length;
    require(len == amounts.length, "Length mismatch");
    for (uint256 i; i < len;) {
        _mint(tos[i], amounts[i]);
        unchecked { ++i; }
    }
}

// ✅Bitwise tracking for multiple bools (Replaces multiple bool vars in storage slots)
uint256 private _flags;
function _getFlag(uint8 bit) internal view returns (bool) { return _flags >> bit & 1 == 1; }
function _setFlag(uint8 bit, bool val) internal {
    if (val) _flags |= (1 << bit);
    else     _flags &= ~(1 << bit);
}
```

---

## 7. Access Control Patterns

```solidity
// ── A: Ownable (Single admin, OZ v5) ──────────────────────────────
import "@openzeppelin/contracts/access/Ownable.sol";
// Pass owner into constructor: constructor() Ownable(msg.sender) {}

// ── B: Ownable2Step (Safe transfer, avoids fat-finger errors) ─────────────────────
import "@openzeppelin/contracts/access/Ownable2Step.sol";
// Takes 2 steps: transferOwnership → acceptOwnership

// ── C: AccessControl (Role-based System) ────────────────────────────────
import "@openzeppelin/contracts/access/AccessControl.sol";
contract RoleContract is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }
    function mint(address to) external onlyRole(MINTER_ROLE) { ... }
}

// ── D: TimelockController (Delayed execution, essential for DAOs) ───────────────
import "@openzeppelin/contracts/governance/TimelockController.sol";
// minDelay: 2 days = 2 * 24 * 3600
// proposers: Addresses permitted to queue
// executors: Addresses permitted to execute (address(0) = anyone can)
```

---

## 8. Upgradeable Contracts (UUPS, OZ v5)

```solidity
// ── Implementation Contract ──────────────────────────────────────────────────
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyContractV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;
    uint256[49] private __gap;   // Reserves 50 slots (1 used)

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }  // Prevent implementation-level init

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

// ── V2: Add new fields ABOVE the __gap array ──────────────────────────────
contract MyContractV2 is MyContractV1 {
    uint256 public newField;    // Occupies previous __gap[0]
    uint256[48] private __gap;  // Decreased by 1
}
```

**Hardhat Deployment/Upgrade (See `references/deploy.md` for full context):**
```typescript
// Initial Deployment
const proxy = await upgrades.deployProxy(V1, [owner], { kind: "uups" });
// Upgrading Later
await upgrades.validateUpgrade(proxyAddr, V2, { kind: "uups" });  // Dry Run Validation
await upgrades.upgradeProxy(proxyAddr, V2);
```
