// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JToken is ERC20 {
    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

    constructor() public ERC20("JToken", "JToken") {
        _mint(msg.sender, _totalSupply);
    }

}