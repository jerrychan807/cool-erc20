// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {getDefaultProvider} from "ethers";

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["JToken"]);

    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Token: (await ethers.getContract('JToken')),
    };

    // we get the tokenOwner
    const {tokenOwner} = await getNamedAccounts();
    // get fet unnammedAccounts (which are basically all accounts not named in the config, useful for tests as you can be sure they do not have been given token for example)
    // we then use the utilities function to generate user object/
    // These object allow you to write things like `users[0].Token.transfer(....)`
    const users = await setupUsers(await getUnnamedAccounts(), contracts);
    // finally we return the whole object (including the tokenOwner setup as a User object)
    return {
        ...contracts,
        users,
        tokenOwner: await setupUser(tokenOwner, contracts),
    };
}


describe("Token contract", function () {
    describe("Transfer", function () {
        it("can't transfer after setting blacklist", async function () {
            const {Token, users, tokenOwner} = await setup();

            // 1.当前账户余额
            let tokenOwnerBalanceWeiBefore = await Token.balanceOf(tokenOwner.address);
            let userBalanceWeiBefore = await Token.balanceOf(users[0].address);
            console.log(' Before Transfer: ');
            console.log('【Step 1】tokenOwnerBalance(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWeiBefore));
            console.log('【Step 1】userBalance(Ether): ' + ethers.utils.formatEther(userBalanceWeiBefore));

            // 2.未设黑名单，tokenOwner转账给user0
            console.log(' Transfer: ');
            console.log('【Step 2】tokenOwner -> 100-> user0: ');
            let amountWei = ethers.utils.parseEther('100.0');
            await tokenOwner.Token.transfer(users[0].address, amountWei);

            let tokenOwnerBalanceWei = await Token.balanceOf(tokenOwner.address);
            let userBalanceWei = await Token.balanceOf(users[0].address);
            console.log('【Step 2】tokenOwnerBalance(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWei));
            console.log('【Step 2】userBalance(Ether): ' + ethers.utils.formatEther(userBalanceWei));

            // 3.设置黑名单
            console.log(' Set blacklist: ');
            console.log('【Step 3】tokenOwner Set user0 in blacklist: ');
            await tokenOwner.Token.setBlackList(users[0].address, true);
            let user0InBlackList = await Token.getBlackList(users[0].address);
            console.log('【Step 3】user0IfBlackList: ' + user0InBlackList);

            expect(user0InBlackList).to.equal(true);

            // 4.设置黑名单后，尝试转账
            console.log(' After setting blacklist, try to transfer: ');
            await expect(tokenOwner.Token.transfer(users[0].address, amountWei)).to.be.reverted;
            console.log('【Step 4】 expect : tokenOwner -> 100-> user0 to.be.reverted');
            let userBalanceWei1 = await Token.balanceOf(users[0].address);
            console.log('【Step 4】userBalance(Ether): ' + ethers.utils.formatEther(userBalanceWei1));
        });
    });

});