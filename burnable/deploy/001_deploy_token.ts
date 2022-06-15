import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {tokenOwner} = await getNamedAccounts();

    await deploy('JToken', {
        from: tokenOwner,
        args: [],
        log: true,
    });
};
export default func;
func.tags = ['JToken'];
