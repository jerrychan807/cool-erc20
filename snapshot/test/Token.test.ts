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
    describe("Transactions", function () {
        it("Check snapshotId和users balance", async function () {
            const {Token, users, tokenOwner} = await setup();

            // 1.查询当前区块数，当前账户余额
            let tokenOwnerBalanceWeiBefore = await Token.balanceOf(tokenOwner.address);
            let userBalanceWeiBefore = await Token.balanceOf(users[0].address);
            console.log(' Before Transfer: ');
            console.log('【Step 1】tokenOwnerBalance(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWeiBefore));
            console.log('【Step 1】userBalance(Ether): ' + ethers.utils.formatEther(userBalanceWeiBefore));

            // 2.tokenOwner转账给user0
            console.log(' Transfer: ');
            console.log('【Step 2】tokenOwner -> 100-> user0: ');
            let amountWei = ethers.utils.parseEther('100.0');
            let tx = await tokenOwner.Token.transfer(users[0].address, amountWei);
            // console.log(tx)  不用wait,该tx就是被确认的tx
            // 交易被确认时的区块数
            console.log('【Step 2】blockNum When tx confirmed: ' + tx.blockNumber);

            let tokenOwnerBalanceWei = await Token.balanceOf(tokenOwner.address);
            let userBalanceWei = await Token.balanceOf(users[0].address);
            console.log('【Step 2】tokenOwnerBalance(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWei));
            console.log('【Step 2】userBalance(Ether): ' + ethers.utils.formatEther(userBalanceWei));

            // 3.检查快照,快照的余额应该是转账前的值
            console.log(' Check Snapshot: ');
            let tokenOwnerBalanceWeiAtSnapshot = await Token.balanceOfAt(tokenOwner.address, tx.blockNumber);
            let userBalanceWeiAtSnapshot = await Token.balanceOfAt(users[0].address, tx.blockNumber);

            console.log('【Step 3】tokenOwnerBalance(Ether) AtSnapshot: ' + ethers.utils.formatEther(tokenOwnerBalanceWeiAtSnapshot) + '  BlockNum :' + tx.blockNumber);
            console.log('【Step 3】userBalance(Ether) AtSnapshot: ' + ethers.utils.formatEther(userBalanceWeiAtSnapshot) + '  BlockNum :' + tx.blockNumber);
            // 快照的余额应该是转账前的值
            expect(tokenOwnerBalanceWeiBefore).to.equal(tokenOwnerBalanceWeiAtSnapshot);
            expect(userBalanceWeiBefore).to.equal(userBalanceWeiAtSnapshot);

            // 4.tokenOwner再次转账给user0
            console.log(' Transfer again: ');
            console.log('【Step 4】tokenOwner -> 100-> user0: ');
            let amountWei1 = ethers.utils.parseEther('100.0');
            tx = await tokenOwner.Token.transfer(users[0].address, amountWei1);
            // console.log(tx)  不用wait,该tx就是被确认的tx
            // 交易被确认时的区块数
            console.log('【Step 4】blockNum When tx confirmed: ' + tx.blockNumber);

            let tokenOwnerBalanceWei1 = await Token.balanceOf(tokenOwner.address);
            let userBalanceWei1 = await Token.balanceOf(users[0].address);
            console.log('【Step 4】tokenOwnerBalance(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWei1));
            console.log('【Step 4】userBalance(Ether): ' + ethers.utils.formatEther(userBalanceWei1));

            // 5.再次检查快照,快照的余额应该是burn前的值
            console.log(' Check Snapshot: ');
            let tokenOwnerBalanceWeiAtSnapshot1 = await Token.balanceOfAt(tokenOwner.address, tx.blockNumber);
            let userBalanceWeiAtSnapshot1 = await Token.balanceOfAt(users[0].address, tx.blockNumber);

            console.log('【Step 5】tokenOwnerBalance(Ether) AtSnapshot: ' + ethers.utils.formatEther(tokenOwnerBalanceWeiAtSnapshot1) + '  BlockNum :' + tx.blockNumber);
            console.log('【Step 5】userBalance(Ether) AtSnapshot: ' + ethers.utils.formatEther(userBalanceWeiAtSnapshot1) + '  BlockNum :' + tx.blockNumber);
            // 快照的余额应该是转账前的值
            expect(tokenOwnerBalanceWei).to.equal(tokenOwnerBalanceWeiAtSnapshot1);
            expect(userBalanceWei).to.equal(userBalanceWeiAtSnapshot1);
        });
    });
    describe("Burn", function () {
        it("Burn, check Snapshot totalsupply", async function () {
            const {Token, users, tokenOwner} = await setup();

            // 1.查询当前区块数，当前代币总供应量
            let tokenOwnerBalanceWeiBefore = await Token.balanceOf(tokenOwner.address);
            let totalSupplyWeiBefore = await Token.totalSupply();
            console.log(' Before burn : ');
            console.log('【Step 1】tokenOwnerBalance(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWeiBefore));
            console.log('【Step 1】totalSupplyWeiBefore(Ether): ' + ethers.utils.formatEther(totalSupplyWeiBefore));

            // 2.tokenOwner burn 100个代币
            console.log(' tokenOwner Burn 100Ether token: ');
            let amountWei = ethers.utils.parseEther('100.0');
            let tx = await tokenOwner.Token.burn(tokenOwner.address, amountWei);
            console.log('【Step 2】blockNum When tx confirmed: ' + tx.blockNumber);

            let tokenOwnerBalanceWei = await Token.balanceOf(tokenOwner.address);
            let totalSupplyWei = await Token.totalSupply();
            console.log('【Step 2】tokenOwnerBalanceWei(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWei));
            console.log('【Step 2】totalSupplyWei(Ether): ' + ethers.utils.formatEther(totalSupplyWei));

            // 3.检查快照,快照的余额应该是转账前的值
            console.log(' Check Snapshot: ');
            let tokenOwnerBalanceWeiAtSnapshot = await Token.balanceOfAt(tokenOwner.address, tx.blockNumber);
            let totalSupplyWeiAtSnapshot = await Token.totalSupplyAt(tx.blockNumber);

            console.log('【Step 3】tokenOwnerBalance(Ether) AtSnapshot: ' + ethers.utils.formatEther(tokenOwnerBalanceWeiAtSnapshot) + '  BlockNum :' + tx.blockNumber);
            console.log('【Step 3】totalSupply(Ether) AtSnapshot: ' + ethers.utils.formatEther(totalSupplyWeiAtSnapshot) + '  BlockNum :' + tx.blockNumber);
            // 快照的余额应该是burn前的值
            expect(tokenOwnerBalanceWeiBefore).to.equal(tokenOwnerBalanceWeiAtSnapshot);
            expect(totalSupplyWeiBefore).to.equal(totalSupplyWeiAtSnapshot);

            // 4.tokenOwner 再次burn 100个代币
            console.log(' tokenOwner Burn 100Ether token Again: ');
            tx = await tokenOwner.Token.burn(tokenOwner.address, amountWei);
            console.log('【Step 4】blockNum When tx confirmed: ' + tx.blockNumber);

            let tokenOwnerBalanceWei1 = await Token.balanceOf(tokenOwner.address);
            let totalSupplyWei1 = await Token.totalSupply();
            console.log('【Step 4】tokenOwnerBalanceWei(Ether): ' + ethers.utils.formatEther(tokenOwnerBalanceWei1));
            console.log('【Step 4】totalSupplyWei(Ether): ' + ethers.utils.formatEther(totalSupplyWei1));

            // 5.再次检查快照
            console.log(' Check Snapshot Again: ');
            let tokenOwnerBalanceWeiAtSnapshot1 = await Token.balanceOfAt(tokenOwner.address, tx.blockNumber);
            let totalSupplyWeiAtSnapshot1 = await Token.totalSupplyAt(tx.blockNumber);

            console.log('【Step 5】tokenOwnerBalance(Ether) AtSnapshot: ' + ethers.utils.formatEther(tokenOwnerBalanceWeiAtSnapshot1) + '  BlockNum :' + tx.blockNumber);
            console.log('【Step 5】totalSupply(Ether) AtSnapshot: ' + ethers.utils.formatEther(totalSupplyWeiAtSnapshot1) + '  BlockNum :' + tx.blockNumber);
            // 快照的余额应该是burn前的值
            expect(tokenOwnerBalanceWei).to.equal(tokenOwnerBalanceWeiAtSnapshot1);
            expect(totalSupplyWei).to.equal(totalSupplyWeiAtSnapshot1);

        });
    });
});