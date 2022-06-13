import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser, routerAbi, usdtAbi, sleep} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

import * as dotenv from 'dotenv';
dotenv.config();


describe("Token contract", function () {
    const adminAddr = '0xABe904f6A2661F36C8ABD3c5DBAEFF2C8214cAC7';
    const normalAddr = '0xaB30879cb7d1ab3c4F6860b2edD252A193e7f8D9';
    const normalAddr2 = '0xe444F15E7858BF9fa128b432DE3846F1c6b293f2';
    const fundAddr = '0xA48d2ED854EffB7c4DAfdB06931633699042c62a';

    const adminUserPk: string = (process.env.ADMIN_PRIVATE_KEY as string);

    const normalUserPk = '91b5601e69a9e4f8dad59bfb04aaa3aa51a66b7ddb6bc1bf39300f60d943daee';

    // 要指定，不然https://www.youtube.com/watch?v=eTM-Ab6G6GA
    const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/2f8547aea34840509a5c3100355555e1");

    let adminUserWallet = new ethers.Wallet(adminUserPk, provider);
    let normalUserWallet = new ethers.Wallet(normalUserPk, provider);

    // const usdtAddress = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"; // bsctestnet usdt
    // const routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"; // bsctestnet PancakeRouter
    const usdtAddress = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";// ropsten Dai
    const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // ropsten uniswap router
    const lpAddress = "0xE2fbd2DF67903c585d3399e7AdeE8b12Bf6C44C5";

    // 测试User Address Buy JToken
    describe("User Address Buy JToken", function () {
        it('User Address Buy JToken', async () => {
            const tokenContract = await ethers.getContract("JToken");
            const routerContract = new ethers.Contract(routerAddress, routerAbi, normalUserWallet);

            const fundAddrBalanceWeiBefore = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiBefore: " + fundAddrBalanceWeiBefore);

            sleep(3000)
            // User Address Buy JToken
            console.log("Try to Buy JToken with Dai");
            let amountIn = ethers.utils.parseEther('1.0');
            let amountOutMin = ethers.utils.parseEther('0.5');
            let deadline = (Date.now() + 100000);
            const path = [usdtAddress, tokenContract.address];
            const tx = await routerContract.swapExactTokensForTokens(amountIn, amountOutMin, path, normalAddr, deadline, {gasLimit: 305000});
            await provider.waitForTransaction(tx.hash, 1, 60000);

            sleep(3000)
            const fundAddrBalanceWeiAfter = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiAfter: " + fundAddrBalanceWeiAfter);
            // 计算收税账户的余额实际变化量
            const fundAddrBalanceWeiChange = fundAddrBalanceWeiAfter.sub(fundAddrBalanceWeiBefore);
            // 计算收税账户的应得量  5%的gas fee
            // Todo:四舍五入问题,减少一个百分比
            let fundAddrGetFeeAmount = amountIn.div(100).mul(4);

            console.log("fundAddrBalanceWeiChange(Ethers): " + ethers.utils.formatEther(fundAddrBalanceWeiChange));
            console.log("fundAddrGetFeeAmount(Ethers): " + ethers.utils.formatEther(fundAddrGetFeeAmount));

            // 计算fee的状况 5%
            // TODO:四舍五入的问题
            expect(fundAddrBalanceWeiChange).to.be.above(fundAddrGetFeeAmount);
        });
    });

    // Todo: 没法Sell
    // 测试User Address Sell JToken
    describe.only("User Address Sell JToken", function () {
        it('User Address Sell JToken', async () => {
            const tokenContract = await ethers.getContract("JToken");
            const routerContract = new ethers.Contract(routerAddress, routerAbi, normalUserWallet);

            const fundAddrBalanceWeiBefore = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiBefore: " + fundAddrBalanceWeiBefore);

            sleep(3000)
            // User Address Sell JToken
            console.log("Try to Sell JToken");
            let amountIn = ethers.utils.parseEther('0.5');
            let amountOutMin = ethers.utils.parseEther('0.1');
            let deadline = (Date.now() + 100000);
            const path = [tokenContract.address, usdtAddress]; // JToken, Dai
            const tx = await routerContract.swapExactTokensForTokens(amountIn, amountOutMin, path, normalAddr, deadline, {gasLimit: 305000});
            await provider.waitForTransaction(tx.hash, 1, 60000);

            sleep(3000)
            const fundAddrBalanceWeiAfter = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiAfter: " + fundAddrBalanceWeiAfter);
            // 计算收税账户的余额实际变化量
            const fundAddrBalanceWeiChange = fundAddrBalanceWeiAfter.sub(fundAddrBalanceWeiBefore);
            // 计算收税账户的应得量  10%的gas fee
            // Todo:四舍五入问题,减少一个百分比
            let fundAddrGetFeeAmount = amountIn.div(100).mul(9);

            console.log("fundAddrBalanceWeiChange(Ethers): " + ethers.utils.formatEther(fundAddrBalanceWeiChange));
            console.log("fundAddrGetFeeAmount(Ethers): " + ethers.utils.formatEther(fundAddrGetFeeAmount));

            // 计算fee的状况 10%
            // TODO:四舍五入的问题
            expect(fundAddrBalanceWeiChange).to.be.above(fundAddrGetFeeAmount);
        });
    });
});