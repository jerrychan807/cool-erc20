import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@nomiclabs/hardhat-etherscan';

// const privateKey = process.env.PRIVATE_KEY;
// const endpoint = process.env.BSCTESTNET_URL;
// const etherscanKey = process.env.ETHERSCAN_KEY;

const config: HardhatUserConfig = {
    defaultNetwork: "bsc_testnet",
    networks: {
        hardhat: {},
        bsc_testnet: {
            // url: "https://speedy-nodes-nyc.moralis.io/5d56294454582e0ca85f1bae/bsc/testnet",
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            chainId: 97,
            gasPrice: 10000000000,
            // gas: 2100000,
            timeout: 30000,
            // accounts: [`0x${privateKey}`]
            accounts: [`xxx`]
        },
        ropsten: {
            url: "https://ropsten.infura.io/v3/2f8547aea34840509a5c3100355555e1",
            chainId: 3,
            gasPrice: 10000000000,
            // gas: 2100000,
            timeout: 30000,
            // accounts: [`0x${privateKey}`]
            accounts: [`xxx`]
        },
        bsc: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            gasPrice: 20000000000,
            timeout: 100000,
            accounts: [`xxx`]
        },
    },
    solidity: {
        version: '0.6.12',
        settings: {
            optimizer: {
                enabled: true,
                runs: 300,
            },
        },
    },
    etherscan: {
        apiKey: "xxx",
    },
    namedAccounts: {
        deployer: '0xABe904f6A2661F36C8ABD3c5DBAEFF2C8214cAC7',
        user: '0xaB30879cb7d1ab3c4F6860b2edD252A193e7f8D9',
        // user: 0,
    },
    paths: {
        sources: 'contracts',
    },
    mocha: {
        timeout: 100000000
    },
};
export default config;
// module.exports = process.env.PRIVATE_KEY;
