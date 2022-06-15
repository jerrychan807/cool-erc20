// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Withdraw.sol";

contract JToken is ERC20, Ownable, Withdraw {
    using SafeMath for uint256;

    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

    uint256 burnFee = 4;
    uint256 taxFee = 1;
    uint256 baseNumber = 100;
    mapping(address => bool) public _whiteList;

    constructor() public ERC20("JToken", "JToken") {
        // 设置白名单
        _whiteList[msg.sender] = true;
        _mint(msg.sender, _totalSupply);
    }

    receive() external payable {}

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

    function _transfer(address sender, address recipient, uint256 amount) internal override {
        // 税收开关
        bool takeFee = true;

        if (_whiteList[sender] || _whiteList[recipient]) {
            takeFee = false;
        }

        if (takeFee) {
            // 燃烧通缩
            uint256 burnAmount = amount.mul(burnFee).div(baseNumber);
            super._burn(sender, burnAmount);

            // 剩余留在合约里
            uint256 taxAmount = amount.mul(taxFee).div(baseNumber);
            super._transfer(sender, address(this), taxAmount);

            uint256 sendAmount = amount.sub(burnAmount).sub(taxAmount);
            super._transfer(sender, recipient, sendAmount);
        } else {
            super._transfer(sender, recipient, amount);
        }

    }

    /**
    *
    * onlyOwner
    *
    */

    function setWhiteList(address _address, bool value) public onlyOwner {
        _whiteList[_address] = value;
    }

    function setBurnFee(uint256 _burnFee) public onlyOwner {
        burnFee = _burnFee;
    }

    function setTaxFee(uint256 _taxFee) public onlyOwner {
        taxFee = _taxFee;
    }

}