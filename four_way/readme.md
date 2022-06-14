


# 需求:

给买卖、添加移除流动性设置不同的税收费率

|  行为   | Fee  | 
|  ----  | ----  |
| Buy  | 5% | 
| Sell  | 10% | 
| AddLiquidity  | 5% | 
| RemoveLiquidity  | 10% | 

# 设置:

- 修改`test/utils/setting.ts`里的`ADMIN_PRIVATE_KEY`,`NormalUser_PRIVATE_KEY`
- 修改`hardhat.config.ts`的`accounts`，`apiKey`

# 测试:

- Transfer
    - [x] Deployment,total supply = token owner
    - [x] whitelist address -> normal address
    - [x] normal address -> normal address
- AddLiquidity
    - [x] whitelist address AddLiquidity
    - [x] whitelist address RemoveLiquidity
    - [x] normal address AddLiquidity （Fee）
    - [x] normal address RemoveLiquidity （Fee）
- RemoveLiquidity
    - [x] whitelist address AddLiquidity
    - [x] whitelist address RemoveLiquidity
    - [x] normal address AddLiquidity （Fee）
    - [x] normal address RemoveLiquidity （Fee）    
- Buy
    - [x] normal address Buy Token（Fee）
- Sell
    - [ ] normal address Sell Token（Fee）


# refs:

- [限制用户卖出币的数量，同时加池子不受影响](https://learnblockchain.cn/question/3458)

