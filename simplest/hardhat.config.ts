import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            mining: {
                auto: true,
                interval: 1000
            }
        }
    },
    solidity: {
        version: '0.8.7',
        settings: {
            optimizer: {
                enabled: true,
                runs: 300,
            },
        },
    },
    namedAccounts: {
        tokenOwner: 0,
        userA: 1,
        userB: 2,

    },
    paths: {
        sources: 'contracts',
    },
    mocha: {
        timeout: 100000000
    },
};
export default config;
