# Cross-Chain Protocol Reference (LayerZero V2 / Chainlink CCIP)

> For L2 deployment differences (Arbitrum/Optimism/Base/zkSync), see `references/l2-deployment.md`

## Table of Contents
1. [Protocol Selection Comparison](#1-protocol-selection-comparison)
2. [LayerZero V2 (OApp / OFT)](#2-layerzero-v2)
3. [Chainlink CCIP](#3-chainlink-ccip)
4. [Cross-Chain Security](#4-cross-chain-security)

---

## 1. Protocol Selection Comparison

| | LayerZero V2 | Chainlink CCIP | Wormhole |
|--|--|--|--|
| Security Model | DVN Decentralized Verifier Network | Chainlink DON Consensus | Guardian Network |
| Chain Coverage | 50+ Chains (Widest) | Mainstream EVM Chains | 30+ Chains |
| Token Bridge Std | OFT (burn/mint) | CCIP Token Pool | Portal (lock/mint) |
| Best For | Widest coverage, ecosystem integration | Enterprise-grade, highest security | Cross EVM + Non-EVM |
| Gas Cost | Medium | Higher (Paid in LINK) | Low |
| Recommended Scenarios | DeFi cross-chain messaging / Multi-chain tokens | Financial-grade asset cross-chain | Multi-chain ecosystem interoperability |

---

## 2. LayerZero V2

### OApp (Omnichain Application) —— Messaging

```bash
npm install @layerzerolabs/lz-evm-oapp-v2
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { OApp, MessagingFee, Origin } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

// Endpoint IDs (Full list: https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts)
// Ethereum:  30101 | Arbitrum: 30110 | Optimism:  30111
// Base:      30184 | Polygon:  30109 | BNB Chain: 30102
// zkSync:    30165 | Avalanche: 30106

contract CrossChainMessenger is OApp {
    using OptionsBuilder for bytes;

    event MessageSent(uint32 indexed dstEid, string message, bytes32 guid);
    event MessageReceived(uint32 indexed srcEid, address sender, string message);

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) {}

    // ── Estimate Cross-Chain Fee (Frontend calls this first) ──────────────────────────
    function quoteSend(uint32 dstEid, string calldata message)
        external view returns (uint256 nativeFee)
    {
        bytes memory payload = abi.encode(message);
        bytes memory options = OptionsBuilder.newOptions()
            .addExecutorLzReceiveOption(200_000, 0);  // Target chain Gas limit, Extra native token
        return _quote(dstEid, payload, options, false).nativeFee;
    }

    // ── Send Cross-Chain Message ──────────────────────────────────────────
    function send(uint32 dstEid, string calldata message) external payable {
        bytes memory payload = abi.encode(message);
        bytes memory options = OptionsBuilder.newOptions()
            .addExecutorLzReceiveOption(200_000, 0);

        MessagingFee memory fee = _quote(dstEid, payload, options, false);
        require(msg.value >= fee.nativeFee, "Insufficient fee");

        bytes32 guid = _lzSend(
            dstEid, payload, options, fee, payable(msg.sender)
        ).guid;
        emit MessageSent(dstEid, message, guid);
    }

    // ── Receive Callback (Automatically triggered on target chain) ────────────────────────────
    function _lzReceive(
        Origin calldata origin,
        bytes32 /* guid */,
        bytes calldata payload,
        address /* executor */,
        bytes calldata /* extraData */
    ) internal override {
        string memory message = abi.decode(payload, (string));
        address sender = address(uint160(uint256(origin.sender)));
        emit MessageReceived(origin.srcEid, sender, message);
        _handleMessage(origin.srcEid, sender, message);
    }

    function _handleMessage(uint32 srcEid, address sender, string memory message) internal virtual {}
}
```

### OFT (Omnichain Fungible Token) —— Cross-Chain Token Standard

OFT uses a burn-mint model (not lock-release), which is naturally resistant to liquidity drainage attacks.

```solidity
import { OFT } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";

contract MyOFT is OFT {
    constructor(
        string memory name,
        string memory symbol,
        address endpoint,
        address owner
    ) OFT(name, symbol, endpoint, owner) {}
    // OFT has built-in: send() burns tokens on source chain, mints equivalent tokens on target chain
    // No extra cross-chain logic needed
}
```

**Frontend sending OFT (ethers.js v6):**

```typescript
import { Options } from '@layerzerolabs/lz-evm-oapp-v2';
import { zeroPadValue, parseEther } from 'ethers';

const dstEid    = 30184;                        // Base
const toAddress = zeroPadValue(recipient, 32);  // bytes32 format
const amount    = parseEther('100');
const options   = Options.newOptions()
    .addExecutorLzReceiveOption(200_000, 0)
    .toHex();

// 1. Estimate fee
const [nativeFee] = await oft.quoteSend(
    [dstEid, toAddress, amount, amount, options, '0x', false], false
);

// 2. Send
const tx = await oft.send(
    [dstEid, toAddress, amount, amount, options, '0x', false],
    [nativeFee, 0n],
    refundAddress,
    { value: nativeFee }
);
await tx.wait();
```

### setPeer (Must be configured after deployment)

```solidity
// Mutual trust between contracts on two chains
// Set Chain B's contract address on Chain A's OApp:
await oappOnChainA.setPeer(
    30184,                              // Chain B Endpoint ID (Base)
    zeroPadValue(oappOnChainBAddr, 32)  // Address in bytes32 format
);
// Likewise set Chain A's address on Chain B
// ⚠️ MUST be configured on BOTH sides, otherwise messages will be rejected
```

---

## 3. Chainlink CCIP

CCIP has the highest security (Chainlink DON multi-layer verification), suitable for financial-grade asset cross-chain capabilities.

```bash
npm install @chainlink/contracts-ccip
```

### Sender Side

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { Client }        from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { IERC20 }        from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 }     from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

// Router Addresses (Mainnet)
// Ethereum:  0x80226fc0Ee2b096224EeaC085Bb9a8cba1146f7D
// Arbitrum:  0x141fa059441E0ca23ce184B6A78bafD2A517DdE8
// Base:      0x881e3A65B4d4a04dD529061dd0071cf975F58bCD
// Optimism:  0x3206695CaE29952f4b0c22a169725a865bc8Ce0f
// Polygon:   0x849c5ED5a80F5B408Dd4969b78c2C8fea3249B4c

// Chain Selectors
// Ethereum:  5009297550715157269
// Arbitrum:  4949039107694359620
// Base:      15971525489660198786
// Optimism:  3734403246176062136
// Polygon:   4051577828743386545

contract CCIPSender {
    using SafeERC20 for IERC20;

    IRouterClient public immutable router;
    IERC20        public immutable linkToken;

    error InsufficientFee(uint256 required, uint256 provided);
    error UnsupportedChain(uint64 chainSelector);

    // Whitelisted target chains (Prevent accidental operations)
    mapping(uint64 => bool) public allowedChains;

    constructor(address _router, address _link) {
        router    = IRouterClient(_router);
        linkToken = IERC20(_link);
    }

    function allowChain(uint64 chainSelector, bool allowed) external {
        allowedChains[chainSelector] = allowed;
    }

    /// @notice Cross-chain send message + tokens (Pay fees with LINK)
    function sendWithLINK(
        uint64  destChainSelector,
        address receiver,
        bytes   calldata data,
        address tokenAddr,
        uint256 tokenAmount
    ) external returns (bytes32 messageId) {
        if (!allowedChains[destChainSelector]) revert UnsupportedChain(destChainSelector);

        Client.EVMTokenAmount[] memory amounts = new Client.EVMTokenAmount[](1);
        amounts[0] = Client.EVMTokenAmount({ token: tokenAddr, amount: tokenAmount });

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver:     abi.encode(receiver),
            data:         data,
            tokenAmounts: amounts,
            extraArgs:    Client._argsToBytes(Client.EVMExtraArgsV1({ gasLimit: 200_000 })),
            feeToken:     address(linkToken),
        });

        uint256 fee = router.getFee(destChainSelector, message);
        linkToken.approve(address(router), fee);
        IERC20(tokenAddr).safeTransferFrom(msg.sender, address(this), tokenAmount);
        IERC20(tokenAddr).approve(address(router), tokenAmount);

        messageId = router.ccipSend(destChainSelector, message);
    }

    /// @notice Estimate LINK fee (Frontend call)
    function quoteFee(uint64 destChainSelector, address receiver, bytes calldata data)
        external view returns (uint256 fee)
    {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver:     abi.encode(receiver),
            data:         data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs:    Client._argsToBytes(Client.EVMExtraArgsV1({ gasLimit: 200_000 })),
            feeToken:     address(linkToken),
        });
        return router.getFee(destChainSelector, message);
    }
}
```

### Receiver Side

```solidity
import { CCIPReceiver }  from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import { Client }        from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract CCIPReceiver_ is CCIPReceiver {
    event MessageReceived(
        bytes32 indexed messageId,
        uint64  indexed srcChainSelector,
        address         sender,
        bytes           data,
        address         tokenAddr,
        uint256         tokenAmount
    );

    // Whitelisted source chains + senders
    mapping(uint64 => mapping(address => bool)) public allowedSenders;

    constructor(address router) CCIPReceiver(router) {}

    function allowSender(uint64 chainSelector, address sender, bool allowed) external {
        allowedSenders[chainSelector][sender] = allowed;
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        address sender = abi.decode(message.sender, (address));
        require(allowedSenders[message.sourceChainSelector][sender], "Not allowed sender");

        address tokenAddr;
        uint256 tokenAmount;
        if (message.destTokenAmounts.length > 0) {
            tokenAddr   = message.destTokenAmounts[0].token;
            tokenAmount = message.destTokenAmounts[0].amount;
        }

        emit MessageReceived(
            message.messageId,
            message.sourceChainSelector,
            sender,
            message.data,
            tokenAddr,
            tokenAmount
        );
        // Process business logic here...
    }
}
```

---

## 4. Cross-Chain Security

Cross-chain interaction is the attack surface causing the heaviest losses in DeFi (over $3B lost from 2022-2024).

### Common Attack Vectors and Protections

| Attack Type | Example | Protection Measures |
|---------|------|---------|
| **Message Forgery** | Ronin Bridge $625M | Verify srcChainId + srcAddress; Use whitelists |
| **Replay Attack** | Same message executed on diff chains | Global messageId deduplication; Incrementing nonces |
| **Liquidity Drain** | Nomad $190M | burn-mint model (OFT) > lock-release; Set daily limits |
| **Oracle Manipulation** | Wormhole $320M | Multi-oracle aggregation; CCIP uses Chainlink DON |
| **Time-Differential Arbitrage** | 7-day challenge period arb | Add timelocks to cross-chain ops; Limit single transaction amounts |

### Secure Coding Checklist

```solidity
contract SafeCrossChainReceiver {
    // ✅ 1. Strict origin verification: Double check srcChainId + srcSender
    mapping(uint32 => mapping(address => bool)) public trustedRemotes;

    // ✅ 2. Deduplicate messageId to prevent replays
    mapping(bytes32 => bool) public processedMessages;
    error AlreadyProcessed(bytes32 messageId);

    // ✅ 3. Amount limits: Single tx + Daily cumulative
    uint256 public constant MAX_SINGLE   = 100_000e6;   // Max $100k USDC single tx
    uint256 public constant MAX_DAILY    = 1_000_000e6; // Max $1M daily
    uint256 public dailyVolume;
    uint256 public lastResetDay;

    function _receive(bytes32 msgId, uint32 srcEid, address srcSender, uint256 amount) internal {
        if (!trustedRemotes[srcEid][srcSender])       revert("Untrusted source");
        if (processedMessages[msgId])                 revert AlreadyProcessed(msgId);
        if (amount > MAX_SINGLE)                      revert("Single limit exceeded");

        uint256 today = block.timestamp / 1 days;
        if (today > lastResetDay) { dailyVolume = 0; lastResetDay = today; }
        dailyVolume += amount;
        if (dailyVolume > MAX_DAILY)                  revert("Daily limit exceeded");

        processedMessages[msgId] = true;
        // Execute business logic...
    }

    // ✅ 4. Emergency Pause (Triggered after Defender Sentinel detects anomalies)
    bool public paused;
    modifier whenNotPaused() { require(!paused, "Paused"); _; }
}
```

### Monitoring Recommendations

```
Production cross-chain protocols MUST monitor:
  1. OpenZeppelin Defender Sentinel  — Monitor abnormally large cross-chain events
  2. LayerZero Scan                  — https://layerzeroscan.com
  3. CCIP Explorer                   — https://ccip.chain.link
  4. Set alert thresholds: Single tx > $50k triggers PagerDuty/Slack
  5. Preconfigure emergency pause multi-sig operations (Safe + Timelock)
```
