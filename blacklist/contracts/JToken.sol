// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

    mapping(address => bool) private _blackList;

    constructor() public ERC20("JToken", "JToken") {
        _mint(msg.sender, _totalSupply);
    }

   /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // 错误写法：只要一个为非黑名单即可
        // require( !_blackList[from] || !_blackList[to], "ERC20: user in black list");

        // 正确写法：同时都为非黑名单
        // require( !_blackList[to], "ERC20: 'to' address in black list");
        // require( !_blackList[from], "ERC20: 'from' address in black list");

        // 正确写法：同时都为非黑名单
        require( !_blackList[to] &&  !_blackList[from], "ERC20: 'to' or 'from' address in black list");
        super._beforeTokenTransfer(from, to, amount);
    }


    function getBlackList(address account) public view returns(bool){
        return _blackList[account];
    }

    // only Owner
    function setBlackList(address account, bool value) public onlyOwner{
        _blackList[account] = value;
    }

}