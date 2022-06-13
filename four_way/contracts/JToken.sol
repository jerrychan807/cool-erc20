// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

import "./ERC20.sol";
import "./IUniswapV2Pair.sol";
import "./IUniswapV2Factory.sol";
import "./IUniswapV2Router.sol";

contract JToken is ERC20 {
    using SafeMath for uint256;

    // IUniswapV2Factory v2Factory;
    //    address v2FactoryAddress = 0x182859893230dC89b114d6e2D547BFFE30474a21;// bsc testnet
    //    address v2RouterAddress = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3; // bsc testnet
    //    address usdtAddress = 0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684; // bsc testnet

    address v2FactoryAddress = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // ropsten
    address v2RouterAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; // ropsten
    address usdtAddress = 0xaD6D458402F60fD3Bd25163575031ACDce07538D; // ropsten Dai
    address public uniswapV2PairAddress;

    mapping(address => bool) private _whiteList;

    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

    uint256 buyFee = 5;
    uint256 sellFee = 10;
    uint256 addLiquidityFee = 5;
    uint256 removeLiquidityFee = 10;
    uint256 baseNumber = 100;

    address fundAddress = 0xA48d2ED854EffB7c4DAfdB06931633699042c62a;

    event transferToFundWhenBuy(address indexed from, address indexed to, uint256 fundAmount);
    event transferToFundWhenSell(address indexed from, address indexed to, uint256 fundAmount);
    event transferToFundWhenAddLiquidity(address indexed from, address indexed to, uint256 fundAmount);
    event transferToFundWhenRemoveLiquidity(address indexed from, address indexed to, uint256 fundAmount);

    constructor() public ERC20("JToken", "JToken") {
        // 调用Factory合约里的createPair函数
        //        IUniswapV2Factory uniswapv2Factory = IUniswapV2Factory(v2FactoryAddress);
        //        uniswapV2PairAddress = uniswapv2Factory.createPair(address(this), usdtAddress);

        address adminAddress = 0xABe904f6A2661F36C8ABD3c5DBAEFF2C8214cAC7;
        _whiteList[adminAddress] = true;
        _whiteList[v2RouterAddress] = true;
        _mint(adminAddress, _totalSupply);
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     * 
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */

    // Buy Fee 5%、addLiquidity Fee: 10%, Sell Fee: 20%, remove Liquidity Fee 15 %
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        // super._transfer(sender, recipient, amount);

        bool takeFee = true;

        // 白名单地址
        if (_whiteList[sender] || _whiteList[recipient]) {
            takeFee = false;
        }

        // 非白名单地址
        if (takeFee) {
            // 判断pair
            if (sender == uniswapV2PairAddress) {// Buy or RemoveLiquidity
                // 查询uniswap储备量
                // 实例化pair
                IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(uniswapV2PairAddress);
                // 获取上一次swap的结果
                (uint112 reserve0, uint112 reserve1,) = uniswapV2Pair.getReserves();
                // Buy: Usdt↑ Token↓
                if ((address(this) == uniswapV2Pair.token0() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) > reserve1)
                    || (address(this) == uniswapV2Pair.token1() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) > reserve0)) {

                    uint256 fundAmount = amount.mul(buyFee).div(baseNumber);
                    // 计算fundAddress获取的份额
                    super._transfer(sender, fundAddress, fundAmount);

                    uint256 recipientAmount = amount.sub(fundAmount);
                    super._transfer(sender, recipient, recipientAmount);

                    emit transferToFundWhenBuy(sender, recipient, fundAmount);
                }
                // RemoveLiquidity: Usdt↓ Token↓
                if ((address(this) == uniswapV2Pair.token0() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) < reserve1)
                    || (address(this) == uniswapV2Pair.token1() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) < reserve0)) {

                    uint256 fundAmount = amount.mul(removeLiquidityFee).div(baseNumber);
                    // 计算fundAddress获取的份额
                    super._transfer(sender, fundAddress, fundAmount);

                    uint256 recipientAmount = amount.sub(fundAmount);
                    super._transfer(sender, recipient, recipientAmount);

                    emit transferToFundWhenRemoveLiquidity(sender, recipient, fundAmount);
                }
            }

            // 判断pair
            if (recipient == uniswapV2PairAddress) {// Sell or AddLiquidity
                // 查询uniswap储备量
                // 实例化pair
                IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(uniswapV2PairAddress);
                // 获取上一次swap的结果
                (uint112 reserve0, uint112 reserve1,) = uniswapV2Pair.getReserves();
                // Sell: Token↑ Usdt↓
                if ((address(this) == uniswapV2Pair.token0() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) < reserve1)
                    || (address(this) == uniswapV2Pair.token1() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) < reserve0)) {

                    uint256 fundAmount = amount.mul(sellFee).div(baseNumber);
                    // 计算fundAddress获取的份额
                    super._transfer(sender, fundAddress, fundAmount);

                    uint256 recipientAmount = amount.sub(fundAmount);
                    super._transfer(sender, recipient, recipientAmount);

                    emit transferToFundWhenSell(sender, recipient, fundAmount);
                }
                // AddLiquidity: Usdt↑ Token↑
                if ((address(this) == uniswapV2Pair.token0() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) > reserve1)
                    || (address(this) == uniswapV2Pair.token1() && IERC20(usdtAddress).balanceOf(uniswapV2PairAddress) > reserve0)) {

                    uint256 fundAmount = amount.mul(addLiquidityFee).div(baseNumber);
                    // 计算fundAddress获取的份额
                    super._transfer(sender, fundAddress, fundAmount);

                    uint256 recipientAmount = amount.sub(fundAmount);
                    super._transfer(sender, recipient, recipientAmount);

                    emit transferToFundWhenAddLiquidity(sender, recipient, fundAmount);
                }
            }

            if (sender != uniswapV2PairAddress && recipient != uniswapV2PairAddress) {
                super._transfer(sender, recipient, amount);
            }
        } else {

            super._transfer(sender, recipient, amount);
        }
    }

    // 应该是管理员才能操作 only owner
    function setWhiteList(address _address, bool value) public {
        _whiteList[_address] = value;
    }

    // only owner
    function setUniswapPairAddr(address _address) public {
        uniswapV2PairAddress = _address;
    }

}