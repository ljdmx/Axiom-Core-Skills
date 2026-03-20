// hardhat.config.ts — Production-Grade Multi-Chain Confguration Template
// OpenZeppelin Contracts v5 + Hardhat Toolbox v4
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import * as dotenv from "dotenv";
dotenv.config();

const PK = process.env.PRIVATE_KEY!;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
      metadata: { bytecodeHash: "none" }, // Reproducible builds
    },
  },

  networks: {
    // ─── Local ─────────────────────────────────────────────
    hardhat: {
      chainId: 31337,
      // Mainnet Fork (uncomment to enable):
      // forking: { url: process.env.MAINNET_RPC_URL!, blockNumber: 19_000_000 },
    },
    localhost: { url: "http://127.0.0.1:8545", chainId: 31337 },

    // ─── Testnets ───────────────────────────────────────────
    sepolia:        { url: process.env.SEPOLIA_RPC_URL!,        accounts: [PK], chainId: 11155111 },
    "arbitrum-sepolia": { url: process.env.ARB_SEPOLIA_RPC_URL!, accounts: [PK], chainId: 421614 },
    "base-sepolia": { url: process.env.BASE_SEPOLIA_RPC_URL!,   accounts: [PK], chainId: 84532 },

    // ─── Mainnets ─────────────────────────────────────────────
    mainnet:   { url: process.env.MAINNET_RPC_URL!,   accounts: [PK], chainId: 1      },
    polygon:   { url: process.env.POLYGON_RPC_URL!,   accounts: [PK], chainId: 137    },
    arbitrum:  { url: process.env.ARBITRUM_RPC_URL!,  accounts: [PK], chainId: 42161  },
    optimism:  { url: process.env.OPTIMISM_RPC_URL!,  accounts: [PK], chainId: 10     },
    base:      { url: process.env.BASE_RPC_URL!,      accounts: [PK], chainId: 8453   },
    zksync:    { url: process.env.ZKSYNC_RPC_URL!,    accounts: [PK], chainId: 324    },
    avalanche: { url: process.env.AVALANCHE_RPC_URL!, accounts: [PK], chainId: 43114  },
    bnb:       { url: process.env.BNB_RPC_URL!,       accounts: [PK], chainId: 56     },
  },

  etherscan: {
    apiKey: {
      mainnet:            process.env.ETHERSCAN_API_KEY!,
      polygon:            process.env.POLYGONSCAN_API_KEY!,
      arbitrumOne:        process.env.ARBISCAN_API_KEY!,
      optimisticEthereum: process.env.OPTIMISM_API_KEY!,
      base:               process.env.BASESCAN_API_KEY!,
      avalanche:          process.env.SNOWTRACE_API_KEY!,
      bsc:                process.env.BSCSCAN_API_KEY!,
      // zkSync requires separate config, see deploy.md §Verification
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.CMC_API_KEY,
    token: "ETH",
    outputFile: "gas-report.txt",
    noColors: true,
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
