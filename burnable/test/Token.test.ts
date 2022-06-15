// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

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
    describe("Deployment", function () {
        // 测试合约拥有者地址是否正确
        it("Should set the right owner", async function () {
            const {Token} = await setup();
            const {tokenOwner} = await getNamedAccounts();
            expect(await Token.owner()).to.equal(tokenOwner);
        });
        // 测试总供应量=合约拥有者余额
        it("Should assign the total supply of tokens to the owner", async function () {
            const {Token, tokenOwner} = await setup();
            const ownerBalance = await Token.balanceOf(tokenOwner.address);
            expect(await Token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens from tokenOwner to user", async function () {
            const {Token, users, tokenOwner} = await setup();
            // Transfer 100 tokens from owner to users[0]
            // 白名单地址没有燃烧、扣税
            let amountWei = ethers.utils.parseEther('100.0');
            await tokenOwner.Token.transfer(users[0].address, amountWei);
            const users0BalanceWei = await Token.balanceOf(users[0].address);
            console.log('users0Balance: ' + ethers.utils.formatEther(users0BalanceWei));
            expect(users0BalanceWei).to.equal(amountWei);

        });

        it("Should transfer tokens from user1 to user2", async function () {
            const {Token, users, tokenOwner} = await setup();
            // 让users[0]初始有余额
            let amountWei1 = ethers.utils.parseEther('100.0');
            await tokenOwner.Token.transfer(users[0].address, amountWei1);

            // Transfer 50 tokens from users[0] to users[1]
            const totalSupplyBefore = await Token.totalSupply();

            // 普通地址有燃烧、扣税
            let amountWei = ethers.utils.parseEther('50.0');
            await users[0].Token.transfer(users[1].address, amountWei);
            const users1Balance = await Token.balanceOf(users[1].address);
            // TotalFee 5%
            const users1ShouldGet = amountWei.div(100).mul(95);
            console.log('users1ShouldGet: ' + ethers.utils.formatEther(users1ShouldGet));
            expect(users1Balance).to.equal(users1ShouldGet);

            // 总供应量减少
            const totalSupplyAfter = await Token.totalSupply();
            console.log('totalSupplyBefore: ' + ethers.utils.formatEther(totalSupplyBefore));
            console.log('totalSupplyAfter: ' + ethers.utils.formatEther(totalSupplyAfter));
            expect(totalSupplyAfter).to.below(totalSupplyBefore);

            // 合约里有剩余1%的代币
            const contractBalanceWei = await Token.balanceOf(Token.address);
            const contractShouldGet = amountWei.div(100).mul(1);
            console.log('contractBalanceWei: ' + ethers.utils.formatEther(contractBalanceWei));
            console.log('contractShouldGet: ' + ethers.utils.formatEther(contractShouldGet));
            expect(contractBalanceWei).to.equal(contractShouldGet);
        });
    });

    // 测试授权
    describe("tokenOwner withdraw from contract", function () {
        it('tokenOwner withdraw from contract', async () => {
            const {Token, users, tokenOwner} = await setup();
            // tokenOwner -> users[0]
            let amountWei1 = ethers.utils.parseEther('100.0');
            await tokenOwner.Token.transfer(users[0].address, amountWei1);
            const tokenOwnerBalanceWeiBefore = await Token.balanceOf(tokenOwner.address);
            console.log('tokenOwnerBalanceWeiBefore: ' + ethers.utils.formatEther(tokenOwnerBalanceWeiBefore));

            // users[0] -> users[1]
            let amountWei = ethers.utils.parseEther('50.0');
            await users[0].Token.transfer(users[1].address, amountWei);

            // 合约里有剩余1%的代币
            const contractBalanceWei = await Token.balanceOf(Token.address);
            console.log('contractBalanceWei: ' + ethers.utils.formatEther(contractBalanceWei));
            // 管理员提取合约里的代币
            await tokenOwner.Token.withdrawToken(Token.address, tokenOwner.address, contractBalanceWei)
            // 合约应该要没有代币了
            const contractBalanceWeiNow = await Token.balanceOf(Token.address);
            console.log('contractBalanceWeiNow: ' + ethers.utils.formatEther(contractBalanceWeiNow));
            expect(contractBalanceWeiNow).to.equal(ethers.utils.parseEther('0.0'));

            // 管理员余额增加
            const tokenOwnerBalanceWeiAfter = await Token.balanceOf(tokenOwner.address);
            console.log('tokenOwnerBalanceWeiAfter: ' + ethers.utils.formatEther(tokenOwnerBalanceWeiAfter));
            const tokenOwnerShouldGet = tokenOwnerBalanceWeiBefore.add(contractBalanceWei);
            console.log('tokenOwnerShouldGet: ' + ethers.utils.formatEther(tokenOwnerShouldGet));
            expect(tokenOwnerBalanceWeiAfter).to.equal(tokenOwnerShouldGet);
        });
    });
});