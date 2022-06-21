// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "hardhat/console.sol";

contract JToken is ERC20Snapshot {
    using SafeMath for uint256;

    uint8  private _decimals = 18;
    uint256 private _totalSupply = 1000 * (10 ** 18);

    uint256 public _currentSnapshotId;

    constructor() public ERC20("JToken", "JToken") {
        _currentSnapshotId = _snapshot();
        _mint(msg.sender, _totalSupply);
    }

    // 自定义了快照id策略，注意其单调性
    function _snapshot() internal override returns (uint256) {
        // console.log('Excute _snapshot()  Now Block num:');
        // console.log(block.number);

        uint256 currentId = block.number;
        _currentSnapshotId = currentId;
        emit Snapshot(currentId);
        return currentId;
    }

    function _getCurrentSnapshotId() internal view override returns (uint256) {
        // console.log('Excute _getCurrentSnapshotId()');
        return _currentSnapshotId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        _snapshot();
        super._beforeTokenTransfer(from, to, amount);
    }

    function burn(address account, uint256 amount) public {
        super._burn(account, amount);
    }
}