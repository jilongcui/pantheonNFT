const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const Web3 = require('web3');
require('dotenv').config();
const mnemonic = fs.readFileSync(".secret").toString().trim();

function newProvider(providerUrl) {
  const secretStr = fs.readFileSync('.secret').toString().trim();
  const privateKeys = secretStr.split('\n')
  console.log(privateKeys);
  console.log(process.env.BSCSCAN_API_KEY);
  const wsProvider = new Web3.providers.WebsocketProvider(providerUrl, {
    // const wsProvider = new Web3.providers.HttpProvider(providerUrl, {
    timeout: 30000, // ms
    clientConfig: {
      maxReceivedFrameSize: 10000000,
      maxReceivedMessageSize: 80000000,
      keepalive: true,
      keepaliveInterval: 6000, // ms
    },
    reconnect: {
      auto: true,
      delay: 15000,
      maxAttempts: false,
      onTimeout: false,
    },
    // headers: { 'x-api-key': this.network.apiKey },
  });
  return new HDWalletProvider({
    privateKeys: privateKeys,
    pollingInterval: 60000,
    providerOrUrl: wsProvider,
  });
}

module.exports = {
  networks: {
    develop: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard BSC port (default: none)
      network_id: "5777",       // Any network (default: none)
      websockets: true
    },

    testnet: {
      provider: () => new HDWalletProvider(mnemonic,
        `https://bsc.getblock.io/testnet/?api_key=d224e8b2-915f-44e8-ba73-3914fcb05900`,
        // `https://data-seed-prebsc-1-s2.binance.org:8545`,
        address_index = 0,//从给的mnemonic数组的第几下标开始取
        num_addresses = 20
      ),
      network_id: 97,
      gas: 8500000,
      confirmations: 5,
      timeoutBlocks: 3000,
      skipDryRun: true
    },
    bsc: {
      provider: newProvider('wss://bsc-ws-node.nariox.org:443'),
      // `https://black-frosty-smoke.bsc.quiknode.pro/2716dc3a83d20ec53b8bdf379dae75c68a39edcb/`,
      //`https://bsc-dataseed3.binance.org`,
      network_id: 56,
      gas: 8500000,
      // gasPrice: 5000000000,
      networkCheckTimeout: 10000,
      confirmations: 5,
      timeoutBlocks: 3000,
      skipDryRun: true
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `wss://rinkeby.infura.io/ws/v3/97bded6c87854eba994937f640dc03f3`),
      network_id: 4,       // Rinkeby's id
      gas: 8500000,
      gasPrice: 1000000000,  // 1 gwei (in wei) (default: 100 gwei)
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.6", // A version or constraint - Ex. "^0.5.0"
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        // evmVersion: "byzantium"
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY
  }
}
