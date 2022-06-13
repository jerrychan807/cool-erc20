import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser, routerAbi, usdtAbi, sleep} from './utils';
import {ADMIN_PRIVATE_KEY, NormalUser_PRIVATE_KEY} from './utils/setting';
import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

describe("Token contract", function () {
    const adminAddr = '0xABe904f6A2661F36C8ABD3c5DBAEFF2C8214cAC7';
    const normalAddr = '0xaB30879cb7d1ab3c4F6860b2edD252A193e7f8D9';
    const normalAddr2 = '0xe444F15E7858BF9fa128b432DE3846F1c6b293f2';

    const adminUserPk = ADMIN_PRIVATE_KEY;
    const normalUserPk = NormalUser_PRIVATE_KEY;

    // 要指定，不然https://www.youtube.com/watch?v=eTM-Ab6G6GA
    const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/2f8547aea34840509a5c3100355555e1");
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

    describe("Check normal address balance", function () {
        it("Check normal address balance", async function () {
            // let balance = await user.getBalance();
            console.log("Normal addr: 123");
            expect(1).to.equal(1);
        });
    });

    describe("Deployment should assign the total supply of tokens to the owner", function () {
        // 测试网不能每次都重新部署,如果在transfer之后，初始持币者的数量就不等于total supply了
        it("Deployment should assign the total supply of tokens to the owner", async function () {
            const tokenContract = await ethers.getContract("JToken");
            let symbol = await tokenContract.symbol();
            let name = await tokenContract.name();
            console.log("Token Symbol: " + symbol);
            console.log("Token Name: " + name);

            const ownerBalance = await tokenContract.balanceOf(adminAddr);
            console.log("ownerBalance Readable: " + ethers.utils.formatUnits(ownerBalance, 18));
            const supply = await tokenContract.totalSupply();
            expect(ownerBalance).to.equal(supply);
        });
    });

    describe.only("Admin Address Transfer to Address B", function () {
        it('Admin Address Transfer to Address B', async () => {
            const tokenContract = await ethers.getContract("JToken");
            let tokenContractWithSigner = tokenContract.connect(adminUserWallet);

            // 转账前检测admin地址的余额
            // const adminBalance = await tokenContract.balanceOf(adminAddr);
            // console.log("adminBalance Before Transfer: " + ethers.utils.formatUnits(adminBalance, 18));
            // sleep(3000)

            let amount = ethers.utils.parseEther('1.0');
            // admin地址转账-> 其他地址
            const tx = await tokenContractWithSigner.transfer(normalAddr, amount)
            await provider.waitForTransaction(tx.hash, 1, 60000)

            sleep(3000)
            const userBalance = await tokenContract.balanceOf(normalAddr);
            console.log("userBalance After Transfer: " + ethers.utils.formatUnits(userBalance, 18));
            // user balance = transfer balance
            // 也可以写成接受者的余额变化
            // expect(amount).to.equal(userBalance);
            expect(userBalance).to.above(amount);
        });
    });

    describe("NormalUser Address Transfer to Another Normal Address", function () {
        it('NormalUser Address Transfer to Another Normal Address', async () => {
            const tokenContract = await ethers.getContract("JToken");

            // 转账前检测普通用户2地址的余额
            const normalAddr2BalanceBefore = await tokenContract.balanceOf(normalAddr2);
            console.log("normalAddr2Balance Before Transfer: " + ethers.utils.formatUnits(normalAddr2BalanceBefore, 18));

            // 普通用户地址1->转账-> 普通用户地址2
            let amount = ethers.utils.parseEther('1.0');
            let tokenContractWithSigner = tokenContract.connect(normalUserWallet);
            const tx = await tokenContractWithSigner.transfer(normalAddr2, amount)
            const res2 = await tx.wait();

            // 检测转账后普通用户2地址的余额
            const normalAddr2BalanceAfter = await tokenContract.balanceOf(normalAddr2);
            console.log("normalAddr2BalanceAfter After Transfer: " + ethers.utils.formatUnits(normalAddr2BalanceAfter, 18));

            expect(normalAddr2BalanceBefore).to.below(normalAddr2BalanceAfter);
        });
    });
});