# Web3 Data Infrastructure (IPFS / The Graph / Subgraph)

> This file is mutually referenced by `frontend-wagmi.md` and `frontend-ethersjs.md`.
> For NFT metadata upload scenarios, also see `references/nft.md`.

## Table of Contents
1. [IPFS Integration (Pinata)](#1-ipfs-integration)
2. [The Graph Queries](#2-the-graph-queries)
3. [Subgraph Development & Deployment](#3-subgraph-development--deployment)

---

## 1. IPFS Integration

**Recommended Service Priority**: Pinata (Most stable) > NFT.Storage (Free) > Web3.Storage

```typescript
// ── Upload File to IPFS (Pinata REST API) ────────────────────────
async function uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('pinataMetadata', JSON.stringify({ name: file.name }));
    form.append('pinataOptions',  JSON.stringify({ cidVersion: 1 }));  // CIDv1 is shorter

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method:  'POST',
        headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
        body:    form,
    });
    if (!res.ok) throw new Error(`IPFS upload failed: ${res.statusText}`);
    const { IpfsHash } = await res.json();
    return `ipfs://${IpfsHash}`;
}

// ── Upload NFT Metadata JSON (OpenSea / Blur Compatible) ────────────
interface NFTMetadata {
    name:          string;
    description:   string;
    image:         string;         // ipfs://Qm... or ipfs://baf...
    external_url?: string;
    animation_url?: string;        // Video / 3D Model / HTML
    attributes: Array<{
        trait_type:   string;
        value:        string | number;
        display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date';
        max_value?:   number;
    }>;
}

async function uploadMetadata(metadata: NFTMetadata): Promise<string> {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method:  'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify({
            pinataContent:  metadata,
            pinataMetadata: { name: `${metadata.name}.json` },
            pinataOptions:  { cidVersion: 1 },
        }),
    });
    if (!res.ok) throw new Error(`Metadata upload failed: ${res.statusText}`);
    const { IpfsHash } = await res.json();
    return `ipfs://${IpfsHash}`;
}

// ── Batch Uploads (NFT Collections) ──────────────────────────────────────
async function uploadCollection(
    items: Array<{ image: File; metadata: Omit<NFTMetadata, 'image'> }>
): Promise<string[]> {
    return Promise.all(
        items.map(async ({ image, metadata }) => {
            const imageUri = await uploadFile(image);
            return uploadMetadata({ ...metadata, image: imageUri });
        })
    );
}

// ── Convert IPFS URI to Accessible HTTP URL ────────────────────────────────
const GATEWAYS = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.io/ipfs/',
];

function toHTTP(uri: string, gatewayIndex = 0): string {
    if (!uri.startsWith('ipfs://')) return uri;
    return GATEWAYS[gatewayIndex] + uri.slice(7);
}

// ── List Pinned Files (Management) ────────────────────────────────────
async function listPinned(pageLimit = 10, pageOffset = 0) {
    const res = await fetch(
        `https://api.pinata.cloud/data/pinList?pageLimit=${pageLimit}&pageOffset=${pageOffset}&status=pinned`,
        { headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` } }
    );
    const { rows, count } = await res.json();
    return { items: rows, total: count };
}
```

---

## 2. The Graph Queries

The Graph is the GraphQL indexing layer for on-chain data. It is 10-100x faster than directly calling RPCs to query historical data.

```bash
npm install @apollo/client graphql
```

```typescript
import { ApolloClient, InMemoryCache, gql, useQuery, useLazyQuery } from '@apollo/client';

// ── Client Configuration ───────────────────────────────────────────────
const graphClient = new ApolloClient({
    uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/<SUBGRAPH_ID>`,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    pools: { keyArgs: ['where', 'orderBy'], merge: false },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: { fetchPolicy: 'cache-and-network' },
    },
});
```

**Common Subgraph Addresses:**
```
Uniswap V3 (Mainnet): FQ6JYszEKApsBpAmiHesRsd9Ygc6mzmpNRANeVQFYoVX
Uniswap V2 (Mainnet): A3Np3RQbaBA6oex5grersRDTeeDpyxqfR83iRmQLkL2h
Aave V3 (Mainnet):    JCNWRypm7FYwV8fx5HhzZPSFaMxgkPuw4TnWmtahDWkE
ENS:                  5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH
OpenSea Seaport:       U71HoAJR89P3sieFzvm5MdBUMoRP7E5qB5Eu16tePgsh
```

```typescript
// ── Uniswap V3 Pool Queries ──────────────────────────────────────
const POOLS_QUERY = gql`
    query TopPools($first: Int!, $skip: Int!, $minTVL: String!) {
        pools(
            first: $first, skip: $skip,
            orderBy: totalValueLockedUSD, orderDirection: desc,
            where: { totalValueLockedUSD_gt: $minTVL }
        ) {
            id
            token0 { id symbol decimals }
            token1 { id symbol decimals }
            feeTier
            totalValueLockedUSD
            volumeUSD
            txCount
            poolDayData(first: 7, orderBy: date, orderDirection: desc) {
                date volumeUSD feesUSD
            }
        }
    }
`;

// React Component
function PoolList() {
    const { data, loading, error, fetchMore } = useQuery(POOLS_QUERY, {
        variables: { first: 20, skip: 0, minTVL: '1000000' },
        client:    graphClient,
        pollInterval: 30_000,
    });

    const loadMore = () => fetchMore({
        variables: { skip: data?.pools.length ?? 0 },
        updateQuery: (prev, { fetchMoreResult }) => ({
            pools: [...(prev.pools ?? []), ...(fetchMoreResult?.pools ?? [])],
        }),
    });

    if (loading && !data) return <p>Loading...</p>;
    if (error)            return <p>Error: {error.message}</p>;

    return (
        <div>
            {data?.pools.map((p: any) => (
                <div key={p.id}>
                    {p.token0.symbol}/{p.token1.symbol} — Fee Tier {p.feeTier / 10000}%
                    — TVL ${Number(p.totalValueLockedUSD).toLocaleString()}
                </div>
            ))}
            <button onClick={loadMore}>Load More</button>
        </div>
    );
}

// ── Query User Transaction History ─────────────────────────────────────────
const USER_SWAPS = gql`
    query UserSwaps($user: String!, $first: Int!) {
        swaps(
            where: { origin: $user }
            first: $first, orderBy: timestamp, orderDirection: desc
        ) {
            id timestamp
            token0 { symbol } token1 { symbol }
            amount0 amount1 amountUSD
            pool { feeTier }
        }
    }
`;
```

---

## 3. Subgraph Development & Deployment

Your own protocols require custom Subgraphs to query on-chain data efficiently.

```bash
npm install --save-dev @graphprotocol/graph-cli @graphprotocol/graph-ts
graph init --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>
```

**schema.graphql (Data Model):**

```graphql
type Token @entity {
    id:          ID!       # Contract address
    symbol:      String!
    decimals:    Int!
    totalSupply: BigInt!
}

type Transfer @entity(immutable: true) {  # immutable: Cannot be updated, faster queries
    id:          Bytes!    # txHash + logIndex
    from:        Bytes!
    to:          Bytes!
    value:       BigInt!
    timestamp:   BigInt!
    blockNumber: BigInt!
    token:       Token!
}

type UserBalance @entity {
    id:      Bytes!        # User address
    balance: BigInt!
    token:   Token!
}
```

**subgraph.yaml (Data Source Configuration):**

```yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: MyToken
    network: mainnet
    source:
      address: "0x..."
      abi: MyToken
      startBlock: 19000000   # ⚠️ Set a reasonable start blok, otherwise sync is extremely slow
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities: [Transfer, UserBalance, Token]
      abis:
        - name: MyToken
          file: ./abis/MyToken.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
      file: ./src/mapping.ts
```

**src/mapping.ts (Event Handlers):**

```typescript
import { Transfer as TransferEvent } from '../generated/MyToken/MyToken';
import { Transfer, UserBalance, Token } from '../generated/schema';
import { BigInt, Bytes }  from '@graphprotocol/graph-ts';

export function handleTransfer(event: TransferEvent): void {
    // 1. Update Token
    let token = Token.load(event.address);
    if (!token) {
        token = new Token(event.address);
        // token.symbol = ... Need to call contract to read
        token.save();
    }

    // 2. Record Transfer (immutable entity)
    const id = event.transaction.hash.concatI32(event.logIndex.toI32());
    const transfer = new Transfer(id);
    transfer.from      = event.params.from;
    transfer.to        = event.params.to;
    transfer.value     = event.params.value;
    transfer.timestamp = event.block.timestamp;
    transfer.blockNumber = event.block.number;
    transfer.token     = event.address;
    transfer.save();

    // 3. Update Receiver's Balance
    const balanceId = event.params.to.concat(event.address);
    let balance = UserBalance.load(balanceId);
    if (!balance) { balance = new UserBalance(balanceId); balance.balance = BigInt.zero(); }
    balance.balance = balance.balance.plus(event.params.value);
    balance.token   = event.address;
    balance.save();
}
```

```bash
# Deploy to The Graph Hosted Service / Decentralized Network
graph codegen && graph build
graph deploy --studio <SUBGRAPH_NAME>   # Studio (Recommended)
# OR
graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH_NAME>
```
