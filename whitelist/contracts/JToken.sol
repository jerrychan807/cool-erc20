// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

    mapping(address => bool) private _whiteList;

    constructor() public ERC20("JToken", "JToken") {
        _whiteList[msg.sender] = true;
        _mint(msg.sender, _totalSupply);
        // 0x00 -> admin addr
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
        // 看场景、其一在白名单中/两者都在白名单中
        require(_whiteList[to] || _whiteList[from], "ERC20: 'to' or 'from' address not in white list");
        super._beforeTokenTransfer(from, to, amount);
    }


    function getWhiteList(address account) public view returns (bool){
        return _whiteList[account];
    }

    // only Owner
    function setWhiteList(address account, bool value) public onlyOwner {
        _whiteList[account] = value;
    }

}