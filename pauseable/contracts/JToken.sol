// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract JToken is ERC20, Ownable, Pausable {
    using SafeMath for uint256;

    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

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
        require(!paused(), "contract is paused");
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
    * onlyOwner
    */
    function setPause() public onlyOwner() {
        _pause();
    }

    function setUnPause() public onlyOwner() {
        _unpause();
    }
}