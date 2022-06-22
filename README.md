# cool-erc20

Erc20 Multi Implementation for learning solidity basics and security


![9BBD0F36-83EE-45DE-BA59-9FD38CCC6078](https://raw.githubusercontent.com/jerrychan807/imggg/master/image/9BBD0F36-83EE-45DE-BA59-9FD38CCC6078.png)

---

## Normal

|  Folder   | escription  | Difficulty |Link |
|  ----  | ----  | ----  |----  |
| burnable  | 发生代币转移时燃烧通缩(4%),税收(1%)留在合约里可提取 | ⭐ | [代码](https://github.com/jerrychan807/cool-erc20/tree/main/burnable) [文章](https://jerrychan807.github.io/2022/21702.html) |
| four_way  | 区分Buy、Sell、AddLiquidity、RemoveLiquidity四种行为 |xx | [代码](https://github.com/jerrychan807/cool-erc20/tree/main/four_way) [文章](https://jerrychan807.github.io/2022/14814.html)  |
| simplest  | 最少代码的 | xx |


## HoneyPot

|  Folder   | escription  | Difficulty | Link |
|  ----  | ----  | ----  |----  |
| prevent_sale  | 阻止代币销售 | ⭐ |xx |
| pauseable  | 可暂停交易 | ⭐⭐ |[代码](https://github.com/jerrychan807/cool-erc20/tree/main/pauseable) [文章](https://jerrychan807.github.io/2022/35217.html) |
| not_sell_all  | 不能出售所有代币 | ⭐ |xx |
| cooldown | 在某个时间/区块内无法交易 | ⭐ |xx |
| anti_whale | 限制用户单笔买卖数量 | ⭐ |xx |
| modified_tax | 税费可修改 | ⭐ |xx |
| blacklist | 黑名单无法交易 | ⭐ |[代码](https://github.com/jerrychan807/cool-erc20/tree/main/blacklist) [文章](https://jerrychan807.github.io/2022/24654.html) |
| whitelist | 白名单可交易 | ⭐ |xx |

## Backdoor

|  Folder   | escription  | Difficulty | Link |
|  ----  | ----  | ----  |----  |
| proxy | 代理 | xx |xx |
| mint  | mint功能，再铸币 | xx |xx |
| retrieve_ownership  | 重新获得所有权 | xx |xx |
| modified_balance  | 管理员可修改用户余额 | xx |xx |

## Advanced

|  Folder   | escription  | Difficulty |Link |
|  ----  | ----  | ----  |----  |
| multi_level_dividend | 推荐,营销,按级数分红 | ⭐⭐⭐ |xx |
| snapshot | 具有快照功能，可查询之前的用户余额和供应量 | ⭐⭐⭐ | [代码](https://github.com/jerrychan807/cool-erc20/tree/main/snapshot) [文章](https://jerrychan807.github.io/2022/8661.html)|
| xxx  | 自动添加流动性 |  xx | xx |
| xx |xx |xx | xx |