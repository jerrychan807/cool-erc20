import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser, routerAbi, usdtAbi, sleep} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {ADMIN_PRIVATE_KEY, NormalUser_PRIVATE_KEY} from './utils/setting';

describe("Token contract", function () {
    const adminAddr = '0xABe904f6A2661F36C8ABD3c5DBAEFF2C8214cAC7';
    const normalAddr = '0xaB30879cb7d1ab3c4F6860b2edD252A193e7f8D9';
    const normalAddr2 = '0xe444F15E7858BF9fa128b432DE3846F1c6b293f2';
    const fundAddr = '0xA48d2ED854EffB7c4DAfdB06931633699042c62a';

    const adminUserPk = ADMIN_PRIVATE_KEY;
    const normalUserPk = NormalUser_PRIVATE_KEY;

    // 要指定，不然https://www.youtube.com/watch?v=eTM-Ab6G6GA
    const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/2f8547aea34840509a5c3100355555e1");

    let adminUserWallet = new ethers.Wallet(adminUserPk, provider);
    let normalUserWallet = new ethers.Wallet(normalUserPk, provider);

    // const usdtAddress = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"; // bsctestnet usdt
    // const routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"; // bsctestnet PancakeRouter
    const usdtAddress = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";// ropsten Dai
    const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // ropsten uniswap router
    const lpAddress = "0xE2fbd2DF67903c585d3399e7AdeE8b12Bf6C44C5";

    // 测试Admin AddLiquidity
    describe("Admin Address AddLiquidity", function () {
        it('Admin Address AddLiquidity', async () => {
            const tokenContract = await ethers.getContract("JToken");
            const routerContract = new ethers.Contract(routerAddress, routerAbi, adminUserWallet);

            // AddLiquidity前查询lp的余额
            // TODO: 如初次添加流动性，怎么查询到lp pair address
            const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);

            // 查询AddLiquidity前的lp里的Usdt和JToken余额
            const lpUsdtBalanceWeiBefore = await usdtContract.balanceOf(lpAddress); // lp的usdt balance
            sleep(3000)
            // lp的JToken balance
            const lpJTokenBalanceWeiBefore = await tokenContract.balanceOf(lpAddress);
            sleep(3000)
            console.log("Before AddLiquidity lp Usdt Balance: " + lpUsdtBalanceWeiBefore);
            console.log("Before AddLiquidity lp JToken Balance: " + lpJTokenBalanceWeiBefore);

            // AddLiquidity
            console.log("Try to AddLiquidity");
            let tokenA = tokenContract.address;
            let tokenB = usdtAddress;
            let amountADesired = ethers.utils.parseEther('50.0');
            let amountBDesired = ethers.utils.parseEther('50.0');
            let amountAMin = ethers.utils.parseEther('50.0');
            let amountBMin = ethers.utils.parseEther('50.0');
            // let to = '';
            let deadline = (Date.now() + 100000);
            const tx = await routerContract.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, adminAddr, deadline, {gasLimit: 305000});
            await provider.waitForTransaction(tx.hash, 1, 60000);


            // 查询AddLiquidity后的lp里的Usdt和JToken余额
            const lpUsdtBalanceWeiAfter = await usdtContract.balanceOf(lpAddress);
            sleep(3000);
            const lpJTokenBalanceWeiAfter = await tokenContract.balanceOf(lpAddress);
            console.log("After AddLiquidity lp Usdt Balance: " + lpUsdtBalanceWeiAfter);
            console.log("After AddLiquidity lp JToken Balance: " + lpJTokenBalanceWeiAfter);

            expect(lpUsdtBalanceWeiAfter).to.be.above(lpUsdtBalanceWeiBefore);
            expect(lpJTokenBalanceWeiAfter).to.be.above(lpJTokenBalanceWeiBefore);
        });
    });

    describe("Admin Address RemoveLiquidity", function () {
        // 测试Admin RemoveLiquidity
        it('Admin Address RemoveLiquidity', async () => {
            const tokenContract = await ethers.getContract("JToken");
            const routerContract = new ethers.Contract(routerAddress, routerAbi, adminUserWallet);
            const pairContract = new ethers.Contract(lpAddress, usdtAbi, adminUserWallet);

            console.log("Try to query LP addr's Usdt&JToken Balance");
            // RemoveLiquidity前查询lp的余额
            const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
            // 查询AddLiquidity前的lp里的Usdt和JToken余额
            const lpUsdtBalanceWeiBefore = await usdtContract.balanceOf(lpAddress); // lp的usdt balance
            sleep(3000);
            // lp的JToken balance
            const lpJTokenBalanceWeiBefore = await tokenContract.balanceOf(lpAddress);
            console.log("Before RemoveLiquidity lp Usdt Balance: " + lpUsdtBalanceWeiBefore);
            console.log("Before RemoveLiquidity lp JToken Balance: " + lpJTokenBalanceWeiBefore);

            // Aprove LPToken 给Pancakeswap Router
            // 查询、未授权的情况下要授权
            console.log("Try to Approve LP Token to Router Address");
            let pairContractWithSigner = pairContract.connect(adminUserWallet);
            let amountEther = '1000000.0';
            let amount = ethers.utils.parseEther(amountEther);
            // Approve
            const tx = await pairContractWithSigner.approve(routerAddress, amount, {gasLimit: 305000});
            await provider.waitForTransaction(tx.hash, 1, 60000);

            // RemoveLiquidity
            console.log("Try to RemoveLiquidity");
            let tokenA = tokenContract.address;
            let tokenB = usdtAddress;
            let liquidity = ethers.utils.parseEther('20.0');
            let amountAMin = ethers.utils.parseEther('10.0');
            let amountBMin = ethers.utils.parseEther('10.0');
            // let to = '';
            let deadline = (Date.now() + 100000);

            const tx2 = await routerContract.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, adminAddr, deadline, {gasLimit: 305000});
            await provider.waitForTransaction(tx2.hash, 1, 60000);

            console.log("Try to query LP addr's Usdt&JToken Balance");
            // 查询AddLiquidity后的lp里的Usdt和JToken余额
            sleep(3000);
            const lpUsdtBalanceWeiAfter = await usdtContract.balanceOf(lpAddress);
            sleep(3000);
            const lpJTokenBalanceWeiAfter = await tokenContract.balanceOf(lpAddress);
            console.log("After RemoveLiquidity lp Usdt Balance: " + lpUsdtBalanceWeiAfter);
            console.log("After RemoveLiquidity lp JToken Balance: " + lpJTokenBalanceWeiAfter);

            expect(lpUsdtBalanceWeiAfter).to.be.below(lpUsdtBalanceWeiBefore);
            expect(lpJTokenBalanceWeiAfter).to.be.below(lpJTokenBalanceWeiBefore);
        });
    });

    // 测试Normal User Add AddLiquidity
    describe("User Address AddLiquidity", function () {
        it('User Address AddLiquidity', async () => {
            const tokenContract = await ethers.getContract("JToken");
            const routerContract = new ethers.Contract(routerAddress, routerAbi, normalUserWallet);

            // AddLiquidity前查询lp的余额
            const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, normalUserWallet);
            let tokenContractWithSigner = tokenContract.connect(normalUserWallet);

            // 查询AddLiquidity前的lp里的Usdt和JToken余额
            // lp的usdt balance
            const lpUsdtBalanceWeiBefore = await usdtContract.balanceOf(lpAddress);
            sleep(3000)
            // lp的JToken balance
            const lpJTokenBalanceWeiBefore = await tokenContract.balanceOf(lpAddress);
            console.log("Before AddLiquidity lp Usdt Balance: " + lpUsdtBalanceWeiBefore);
            console.log("Before AddLiquidity lp JToken Balance: " + lpJTokenBalanceWeiBefore);

            const fundAddrBalanceWeiBefore = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiBefore: " + fundAddrBalanceWeiBefore);

            // sleep(3000)
            console.log("Try to approve");
            // // approve USDT和Jtoken给router
            // let amountEther = '1000000.0';
            // let amount = ethers.utils.parseEther(amountEther);
            // console.log("Try to approve JToken to router");
            // const tx1 = await tokenContractWithSigner.approve(routerAddress, amount, {gasLimit: 305000});
            // await provider.waitForTransaction(tx1.hash, 1, 60000)
            //
            // sleep(3000)
            // console.log("Try to approve USDT to router");
            // const tx2 = await usdtContract.approve(routerAddress, amount, {gasLimit: 305000});
            // await provider.waitForTransaction(tx2.hash, 1, 60000)

            sleep(3000)
            // AddLiquidity
            console.log("Try to AddLiquidity");
            let tokenA = usdtAddress;
            let tokenB = tokenContract.address;
            let amountIn = ethers.utils.parseEther('5.0');
            let amountADesired = amountIn;
            let amountBDesired = amountIn;
            let amountAMin = ethers.utils.parseEther('4.0');
            let amountBMin = ethers.utils.parseEther('4.0');
            // let to = '';
            let deadline = (Date.now() + 100000);
            const tx = await routerContract.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, normalAddr, deadline, {gasLimit: 305000});
            await provider.waitForTransaction(tx.hash, 1, 60000);

            sleep(3000)
            // 查询AddLiquidity后的lp里的Usdt和JToken余额
            const lpUsdtBalanceWeiAfter = await usdtContract.balanceOf(lpAddress);
            sleep(3000)
            const lpJTokenBalanceWeiAfter = await tokenContract.balanceOf(lpAddress);
            console.log("After AddLiquidity lp Usdt Balance: " + lpUsdtBalanceWeiAfter);
            console.log("After AddLiquidity lp JToken Balance: " + lpJTokenBalanceWeiAfter);
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
            /// remove Liquidity后
            expect(lpUsdtBalanceWeiAfter).to.be.above(lpUsdtBalanceWeiBefore);
            expect(lpJTokenBalanceWeiAfter).to.be.above(lpJTokenBalanceWeiBefore);
            // 计算fee的状况 5%
            // TODO:四舍五入的问题 理想获得的是0.25 实际上获得的是0.24xxx
            expect(fundAddrBalanceWeiChange).to.be.above(fundAddrGetFeeAmount);
        });
    });

    describe.only("fundAddrBalance", function () {
        it('fundAddrBalance', async () => {
            const tokenContract = await ethers.getContract("JToken");
            let amountInEther = '5.0';
            let amountIn = ethers.utils.parseEther(amountInEther);

            let fundAddrGetFeeAmount = amountIn.div(100).mul(10);
            console.log("fundAddrGetFeeAmount: " + fundAddrGetFeeAmount);

            const fundAddrBalanceWei = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWei: " + fundAddrBalanceWei);

            // 计算fee的状况 10%
            expect(fundAddrBalanceWei).to.be.above(fundAddrGetFeeAmount);
        });
    });

    // 测试Normal User Remove AddLiquidity
    describe("User Address Remove Liquidity", function () {
        it('User Address Remove Liquidity', async () => {
            const tokenContract = await ethers.getContract("JToken");
            const routerContract = new ethers.Contract(routerAddress, routerAbi, normalUserWallet);
            const pairContract = new ethers.Contract(lpAddress, usdtAbi, normalUserWallet);

            // RemoveLiquidity前查询lp的余额
            const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, normalUserWallet);

            // 查询RemoveLiquidity前的lp里的Usdt和JToken余额
            // lp的usdt balance
            const lpUsdtBalanceWeiBefore = await usdtContract.balanceOf(lpAddress);
            sleep(3000)
            // lp的JToken balance
            const lpJTokenBalanceWeiBefore = await tokenContract.balanceOf(lpAddress);
            console.log("Before RemoveLiquidity lp Usdt Balance: " + ethers.utils.formatEther(lpUsdtBalanceWeiBefore));
            console.log("Before RemoveLiquidity lp JToken Balance: " + ethers.utils.formatEther(lpJTokenBalanceWeiBefore));

            const fundAddrBalanceWeiBefore = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiBefore: " + ethers.utils.formatEther(fundAddrBalanceWeiBefore));

            sleep(3000)

            // Aprove LPToken 给Pancakeswap Router
            // 查询、未授权的情况下要授权
            console.log("Try to Approve LP Token to Router Address");
            let pairContractWithSigner = pairContract.connect(normalUserWallet);
            let amount = ethers.utils.parseEther('1000000.0');
            // Approve
            const tx1 = await pairContractWithSigner.approve(routerAddress, amount, {gasLimit: 305000});
            await provider.waitForTransaction(tx1.hash, 1, 60000);

            sleep(3000)
            // Try to RemoveLiquidity
            console.log("Try to RemoveLiquidity");
            let tokenA = tokenContract.address;
            let tokenB = usdtAddress;
            let amountIn = ethers.utils.parseEther('2.0');
            let liquidity = amountIn;
            let amountAMin = ethers.utils.parseEther('1.0');
            let amountBMin = ethers.utils.parseEther('1.0');
            // let to = '';
            let deadline = (Date.now() + 100000);

            const tx = await routerContract.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, normalAddr, deadline, {gasLimit: 305000});
            await provider.waitForTransaction(tx.hash, 1, 60000);

            sleep(3000)
            // 查询RemoveLiquidity后的lp里的Usdt和JToken余额
            const lpUsdtBalanceWeiAfter = await usdtContract.balanceOf(lpAddress);
            sleep(3000)
            const lpJTokenBalanceWeiAfter = await tokenContract.balanceOf(lpAddress);
            console.log("After RemoveLiquidity lp Usdt Balance: " + ethers.utils.formatEther(lpUsdtBalanceWeiAfter));
            console.log("After RemoveLiquidity lp JToken Balance: " + ethers.utils.formatEther(lpJTokenBalanceWeiAfter));
            sleep(3000)

            const fundAddrBalanceWeiAfter = await tokenContract.balanceOf(fundAddr);
            console.log("fundAddrBalanceWeiAfter: " + ethers.utils.formatEther(fundAddrBalanceWeiAfter));
            // 计算收税账户的余额实际变化量
            const fundAddrBalanceWeiChange = fundAddrBalanceWeiAfter.sub(fundAddrBalanceWeiBefore);
            // 计算收税账户的应得量 10%的gas fee
            // Todo:四舍五入问题,减少一个百分比
            let fundAddrGetFeeAmount = amountIn.div(100).mul(9);

            console.log("fundAddrBalanceWeiChange(Ethers): " + ethers.utils.formatEther(fundAddrBalanceWeiChange));
            console.log("fundAddrGetFeeAmount(Ethers): " + ethers.utils.formatEther(fundAddrGetFeeAmount));
            /// remove Liquidity后
            expect(lpUsdtBalanceWeiBefore).to.be.above(lpUsdtBalanceWeiAfter);
            expect(lpJTokenBalanceWeiBefore).to.be.above(lpJTokenBalanceWeiAfter);
            // 计算fee的状况 10%
            expect(fundAddrBalanceWeiChange).to.be.above(fundAddrGetFeeAmount);
        });
    });
});