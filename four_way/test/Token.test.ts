import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser, routerAbi, usdtAbi} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {ADMIN_PRIVATE_KEY, NormalUser_PRIVATE_KEY} from './utils/setting';


describe("Token contract", function () {
    const adminAddr = '0xABe904f6A2661F36C8ABD3c5DBAEFF2C8214cAC7';
    const normalAddr = '0xaB30879cb7d1ab3c4F6860b2edD252A193e7f8D9';
    const normalAddr2 = '0xe444F15E7858BF9fa128b432DE3846F1c6b293f2';

    const adminUserPk = ADMIN_PRIVATE_KEY;
    const normalUserPk = NormalUser_PRIVATE_KEY;

    // 要指定，不然https://www.youtube.com/watch?v=eTM-Ab6G6GA
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
    let adminUserWallet = new ethers.Wallet(adminUserPk, provider);
    let normalUserWallet = new ethers.Wallet(normalUserPk, provider);

    // before(async function () {
    //     const namedAccounts = await getNamedAccounts();
    //     user = namedAccounts.user;
    //     userSigner = await ethers.provider.getSigner(user);
    //
    // });

    // beforeEach(async function () {
    //
    // });

    describe("contract tests1", function () {
        it("Check normal address balance", async function () {
            // let balance = await user.getBalance();
            console.log("Normal addr: 123");
            expect(1).to.equal(1);
        });
    });

    // 测试授权
    describe("contract tests1", function () {
        it('Admin Address Approve to Router', async () => {
            const tokenContract = await ethers.getContract("JToken");

            const routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
            const routerContract = new ethers.Contract(routerAddress, routerAbi, adminUserWallet);
            // let routerContractName = await routerContract.WETH();
            // console.log("routerContractName: " + routerContractName);

            // Aprove JToken 给pancakeswap Router
            // 查询、未授权的情况下要授权
            let tokenContractWithSigner = tokenContract.connect(adminUserWallet);
            let amountEther = '1000000.0';
            let amount = ethers.utils.parseEther(amountEther);
            // Approve
            // await tokenContractWithSigner.approve(routerAddress, amount);

            let approveAmountWei = await tokenContractWithSigner.allowance(adminAddr, routerAddress);
            let approveAmountEther = ethers.utils.formatEther(approveAmountWei);
            expect(amountEther).to.equal(approveAmountEther);
        });
    });
});