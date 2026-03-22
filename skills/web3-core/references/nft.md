# NFT Development Reference Manual

## Table of Contents
1. [NFT Standard Comparison](#1-nft-standard-comparison)
2. [ERC-721 Production Implementation](#2-erc-721-production-implementation)
3. [ERC-1155 Multi-Token Contract](#3-erc-1155-multi-token-contract)
4. [Merkle Tree Whitelisting](#4-merkle-tree-whitelisting)
5. [On-Chain SVG NFTs](#5-on-chain-svg-nfts)
6. [NFT Marketplace Integration](#6-nft-marketplace-integration)

---

## 1. NFT Standard Comparison

| Feature | ERC-721 | ERC-1155 |
|---------|---------|----------|
| Per ID  | Unique NFT | Can be Fungible or Non-Fungible |
| Batching| Not supported (Needs loop) | Natively supported |
| Gas Eff | Average | Highly efficient for batching |
| Use Case| PFPs, 1-of-1 Art | Game Items, Semi-Fungible Tokens |
| Royalty | EIP-2981 | EIP-2981 |

---

## 2. ERC-721 Production Implementation

> See `solidity.md` → Detailed ERC-721 implementation (Including royalties, reveal, whitelists, etc.)

### ERC-721A (Gas-Optimized Batch Minting)

ERC-721A was developed by the Azuki team. Gas consumption for batch minting is close to that of a single mint.

```bash
npm install erc721a
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MyNFT is ERC721A, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public constant PRICE = 0.08 ether;
    uint256 public constant MAX_BATCH = 10;

    string private _baseTokenURI;
    bytes32 public merkleRoot;
    
    enum SalePhase { Closed, Whitelist, Public }
    SalePhase public phase;

    mapping(address => uint256) public whitelistMinted;

    constructor() ERC721A("MyNFT", "MNFT") Ownable(msg.sender) {}

    // ERC-721A uses _startTokenId() to control the starting ID
    function _startTokenId() internal pure override returns (uint256) {
        return 1;  // Start exactly at 1 instead of 0
    }

    // ─── Whitelist Mint ──────────────────────────────────────────
    function whitelistMint(uint256 quantity, bytes32[] calldata proof)
        external payable
    {
        require(phase == SalePhase.Whitelist, "Not whitelist phase");
        require(msg.value >= PRICE * quantity, "Insufficient payment");
        require(_totalMinted() + quantity <= MAX_SUPPLY, "Exceeds supply");
        require(whitelistMinted[msg.sender] + quantity <= 2, "Exceeds whitelist limit");
        
        // Verify Merkle Proof
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender))));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        whitelistMinted[msg.sender] += quantity;
        _mint(msg.sender, quantity);
    }

    // ─── Public Mint ────────────────────────────────────────────
    function publicMint(uint256 quantity) external payable {
        require(phase == SalePhase.Public, "Not public phase");
        require(msg.value >= PRICE * quantity, "Insufficient payment");
        require(_totalMinted() + quantity <= MAX_SUPPLY, "Exceeds supply");
        require(quantity <= MAX_BATCH, "Exceeds max batch");

        _mint(msg.sender, quantity);
    }

    // ─── Admin ────────────────────────────────────────────────
    function setPhase(SalePhase _phase) external onlyOwner { phase = _phase; }
    function setMerkleRoot(bytes32 _root) external onlyOwner { merkleRoot = _root; }
    function setBaseURI(string calldata uri) external onlyOwner { _baseTokenURI = uri; }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function withdraw() external onlyOwner {
        (bool ok,) = msg.sender.call{value: address(this).balance}("");
        require(ok);
    }
}
```

---

## 3. ERC-1155 Multi-Token Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title GameItems —ERC-1155 Game Item Contract
contract GameItems is ERC1155, ERC1155Supply, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token ID Definitions
    uint256 public constant GOLD     = 0;  // Fungible Gold
    uint256 public constant SWORD    = 1;  // NFT Weapon
    uint256 public constant SHIELD   = 2;  // NFT Shield
    uint256 public constant POTION   = 3;  // Stackable Potion

    // Token Names
    mapping(uint256 => string) public tokenName;
    // Max supply for specific tokens
    mapping(uint256 => uint256) public maxSupply;

    constructor() ERC1155("https://api.mygame.com/tokens/{id}.json")
        AccessControl()
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        tokenName[GOLD]   = "Gold";
        tokenName[SWORD]  = "Legendary Sword";
        tokenName[SHIELD] = "Dragon Shield";
        tokenName[POTION] = "Health Potion";

        maxSupply[SWORD]  = 1_000;
        maxSupply[SHIELD] = 500;
    }

    // ─── Minting ────────────────────────────────────────────────
    function mint(address to, uint256 id, uint256 amount, bytes memory data)
        external onlyRole(MINTER_ROLE)
    {
        if (maxSupply[id] > 0) {
            require(totalSupply(id) + amount <= maxSupply[id], "Exceeds max supply");
        }
        _mint(to, id, amount, data);
    }

    // Batch Minting (Gas Efficient)
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    // ─── Burning ────────────────────────────────────────────────
    function burn(address from, uint256 id, uint256 amount) external {
        require(from == msg.sender || isApprovedForAll(from, msg.sender));
        _burn(from, id, amount);
    }

    // ─── Interface Overrides ─────────────────────────────────────────────
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
```

---

## 4. Merkle Tree Whitelisting

### Generating Merkle Tree (JavaScript)

```javascript
// npm install merkletreejs keccak256

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { ethers } = require('ethers');

// Whitelisted Addresses
const whitelist = [
    "0x1234...",
    "0x5678...",
    "0xabcd...",
];

// Generate leaf nodes (Encoding must match the contract)
const leaves = whitelist.map(addr =>
    ethers.solidityPackedKeccak256(['address'], [addr])
);

// Build Merkle Tree
const tree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
    hashLeaves: false,
});

const root = tree.getHexRoot();
console.log("Merkle Root:", root);  // Set this to the contract

// Generate proof for an address
function getProof(address) {
    const leaf = ethers.solidityPackedKeccak256(['address'], [address]);
    return tree.getHexProof(leaf);
}

// Verify proof (Off-chain)
function verify(address, proof) {
    const leaf = ethers.solidityPackedKeccak256(['address'], [address]);
    return tree.verify(proof, leaf, root);
}
```

### Verification inside Contract (Solidity)

```solidity
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

bytes32 public merkleRoot;

function isWhitelisted(address user, bytes32[] calldata proof)
    public view returns (bool)
{
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(user))));
    return MerkleProof.verify(proof, merkleRoot, leaf);
}
```

---

## 5. On-Chain SVG NFTs

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title OnchainNFT —100% on-chain stored NFT
contract OnchainNFT is ERC721 {
    using Strings for uint256;

    uint256 private _nextTokenId;

    constructor() ERC721("Onchain NFT", "ONFT") {}

    function mint() external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public view override returns (string memory)
    {
        _requireOwned(tokenId);

        string memory svg = generateSVG(tokenId);
        string memory json = string.concat(
            '{"name":"Onchain NFT #', tokenId.toString(), '",',
            '"description":"Fully on-chain NFT",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes":[',
                '{"trait_type":"Token ID","value":', tokenId.toString(), '},',
                '{"trait_type":"Color","value":"', getColor(tokenId), '"}',
            ']}'
        );

        return string.concat(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        );
    }

    function generateSVG(uint256 tokenId) internal view returns (string memory) {
        string memory color = getColor(tokenId);
        string memory id = tokenId.toString();
        
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">',
            '<rect width="500" height="500" fill="#', color, '"/>',
            '<text x="250" y="240" font-size="40" text-anchor="middle" fill="white">',
            'NFT #', id,
            '</text>',
            '<text x="250" y="300" font-size="20" text-anchor="middle" fill="rgba(255,255,255,0.7)">',
            block.timestamp.toString(),
            '</text>',
            '</svg>'
        );
    }

    function getColor(uint256 tokenId) internal view returns (string memory) {
        // Pseudo-random root generation based on tokenId and blockhash
        bytes32 hash = keccak256(abi.encodePacked(tokenId, blockhash(block.number - 1)));
        bytes3 color = bytes3(hash);
        return toHexString(color);
    }

    function toHexString(bytes3 b) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory str = new bytes(6);
        for (uint256 i = 0; i < 3; i++) {
            str[i * 2]     = hexChars[uint8(b[i]) >> 4];
            str[i * 2 + 1] = hexChars[uint8(b[i]) & 0x0f];
        }
        return string(str);
    }
}
```

---

## 6. NFT Marketplace Integration

### EIP-2981 Royalty Standard (Supported by OpenSea / Blur)

```solidity
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract MyNFT is ERC721, ERC2981 {
    constructor() ERC721("MyNFT", "MNFT") {
        _setDefaultRoyalty(msg.sender, 500);  // 5% (500 basis points)
    }
    // Set specific royalty for a single Token ID
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator)
        external onlyOwner { _setTokenRoyalty(tokenId, receiver, feeNumerator); }

    function supportsInterface(bytes4 id) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(id);
    }
}
```

### Reservoir SDK (NFT Market Aggregation, Recommended for Production)

Reservoir aggregates major marketplaces like OpenSea, Blur, LooksRare, X2Y2. It is the most common integration method for NFT dApps in 2024.

```bash
npm install @reservoir0x/reservoir-sdk @reservoir0x/reservoir-kit-ui
```

```typescript
import { getClient, Execute } from '@reservoir0x/reservoir-sdk';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Initialization (At App Entry)
getClient()—.configure({
    chains: [{ id: 1, baseApiUrl: 'https://api.reservoir.tools', active: true }],
    source: 'my-dapp.xyz',
    apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
});

// ── Query NFT Floor Price ──────────────────────────────────────────
async function getFloorPrice(contractAddr: string): Promise<number> {
    const res = await fetch(
        `https://api.reservoir.tools/collections/v7—id=${contractAddr}`,
        { headers: { 'x-api-key': process.env.RESERVOIR_API_KEY! } }
    );
    const { collections } = await res.json();
    return collections[0]—.floorAsk—.price—.amount—.usd —— 0;
}

// ── Query NFT Listings (Active) ────────────────────────────────────
async function getListings(contractAddr: string, tokenId—: string) {
    const url = new URL('https://api.reservoir.tools/orders/asks/v5');
    url.searchParams.set('contracts', contractAddr);
    if (tokenId) url.searchParams.set('tokenSetId', `token:${contractAddr}:${tokenId}`);
    url.searchParams.set('limit', '20');
    url.searchParams.set('sortBy', 'price');

    const res = await fetch(url, { headers: { 'x-api-key': process.env.RESERVOIR_API_KEY! } });
    const { orders } = await res.json();
    return orders;
}

// ── Buy NFT (Best price aggregated) ─────────────────────────────────
async function buyNFT(tokenId: string, contractAddr: string, walletClient: any) {
    await getClient()!.actions.buyToken({
        items: [{ token: `${contractAddr}:${tokenId}` }],
        wallet: walletClient,
        onProgress: (steps: Execute['steps']) => {
            steps.forEach(step => console.log(step.action, step.status));
        },
    });
}

// ── List NFT for Sale ──────────────────────────────────────────────
async function listNFT(
    tokenId: string, contractAddr: string,
    priceEth: number, expirationDays: number,
    walletClient: any
) {
    await getClient()!.actions.listToken({
        listings: [{
            token:      `${contractAddr}:${tokenId}`,
            weiPrice:   BigInt(Math.floor(priceEth * 1e18)).toString(),
            orderbook:  'reservoir',  // Or 'opensea'
            orderKind:  'seaport-v1.6',
            expirationTime: String(Math.floor(Date.now() / 1000) + expirationDays * 86400),
        }],
        wallet: walletClient,
        onProgress: (steps: Execute['steps']) => console.log(steps),
    });
}
```

---

## 7. Dynamic NFTs

Dynamic NFTs automatically alter their metadata (image, traits, etc.) reacting to on-chain events or off-chain data. They form the core mechanism of web3 games, sports cards, and DeFi position NFTs.

### Pattern 1: On-Chain State Driven tokenURI

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title DynamicNFT —Evolves SVG/Metadata based on on-chain state
contract DynamicNFT is ERC721, Ownable {
    using Strings for uint256;

    enum Stage { Egg, Hatch, Adult, Legend }

    struct TokenData {
        Stage   stage;
        uint256 xp;        // Experience (Earned via fights/quests)
        uint256 lastActive;
    }

    mapping(uint256 => TokenData) public tokenData;
    uint256 private _nextId = 1;

    event StageEvolved(uint256 indexed tokenId, Stage newStage);

    constructor(address owner) ERC721("DynamicCreature", "DCRE") Ownable(owner) {}

    function mint(address to) external onlyOwner {
        uint256 id = _nextId++;
        tokenData[id] = TokenData({ stage: Stage.Egg, xp: 0, lastActive: block.timestamp });
        _mint(to, id);
    }

    // Gain XP (Called by the Game Contract)
    function gainXP(uint256 tokenId, uint256 amount) external {
        _requireOwned(tokenId);
        TokenData storage d = tokenData[tokenId];
        d.xp         += amount;
        d.lastActive  = block.timestamp;
        _checkEvolution(tokenId, d);
    }

    function _checkEvolution(uint256 tokenId, TokenData storage d) internal {
        Stage newStage;
        if      (d.xp >= 10_000) newStage = Stage.Legend;
        else if (d.xp >= 1_000)  newStage = Stage.Adult;
        else if (d.xp >= 100)    newStage = Stage.Hatch;
        else                      return;

        if (newStage > d.stage) {
            d.stage = newStage;
            emit StageEvolved(tokenId, newStage);
        }
    }

    // tokenURI is entirely derived from on-chain state (No IPFS needed)
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        TokenData memory d = tokenData[tokenId];

        string memory stageName = _stageName(d.stage);
        string memory color     = _stageColor(d.stage);
        string memory svg       = _buildSVG(tokenId, stageName, color, d.xp);

        string memory json = Base64.encode(bytes(string.concat(
            '{"name":"Creature #', tokenId.toString(),
            '","description":"A dynamic on-chain creature","stage":"', stageName,
            '","image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)),
            '","attributes":[',
                '{"trait_type":"Stage","value":"',   stageName, '"},',
                '{"trait_type":"XP","value":',       d.xp.toString(), ',',
                 '"display_type":"number"},',
                '{"trait_type":"Last Active","value":', d.lastActive.toString(), ',',
                 '"display_type":"date"}',
            ']}'
        )));

        return string.concat('data:application/json;base64,', json);
    }

    function _buildSVG(uint256 id, string memory name, string memory color, uint256 xp)
        internal pure returns (string memory)
    {
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">',
            '<rect width="300" height="300" fill="', color, '"/>',
            '<text x="150" y="130" text-anchor="middle" font-size="48">',
            _stageEmoji(name), '</text>',
            '<text x="150" y="180" text-anchor="middle" fill="white" font-size="20">#',
            id.toString(), ' ', name, '</text>',
            '<text x="150" y="220" text-anchor="middle" fill="white" font-size="14">XP: ',
            xp.toString(), '</text>',
            '</svg>'
        );
    }

    function _stageName(Stage s) internal pure returns (string memory) {
        if (s == Stage.Legend) return "Legend";
        if (s == Stage.Adult)  return "Adult";
        if (s == Stage.Hatch)  return "Hatch";
        return "Egg";
    }
    function _stageColor(Stage s) internal pure returns (string memory) {
        if (s == Stage.Legend) return "#FFD700";
        if (s == Stage.Adult)  return "#7C3AED";
        if (s == Stage.Hatch)  return "#2563EB";
        return "#6B7280";
    }
    function _stageEmoji(string memory name) internal pure returns (string memory) {
        bytes32 h = keccak256(bytes(name));
        if (h == keccak256("Legend")) return unicode"🌟";
        if (h == keccak256("Adult"))  return unicode"🐉";
        if (h == keccak256("Hatch"))  return unicode"🐣";
        return unicode"🥚";
    }
}
```

### Pattern 2: Automating Updates via Chainlink Automation

```solidity
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract AutoDynamicNFT is DynamicNFT, AutomationCompatibleInterface {
    uint256 public lastUpdate;
    uint256 public constant UPDATE_INTERVAL = 1 days;

    // Chainlink Automation checks if an upkeep is needed
    function checkUpkeep(bytes calldata) external view override
        returns (bool upkeepNeeded, bytes memory)
    {
        upkeepNeeded = (block.timestamp - lastUpdate) >= UPDATE_INTERVAL;
    }

    // Chainlink Automation executes the upkeep (Triggered automatically)
    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastUpdate) < UPDATE_INTERVAL) return;
        lastUpdate = block.timestamp;
        // Example: Decay XP automatically over time (Pets that "starve" without activity)
        for (uint256 id = 1; id < _nextId;) {
            if (block.timestamp - tokenData[id].lastActive > 7 days) {
                if (tokenData[id].xp >= 10) tokenData[id].xp -= 10;
            }
            unchecked { ++id; }
        }
    }
}
```
