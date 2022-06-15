# 需求:

代币发生转移时：

- 进行燃烧通缩（4%），TotalSupply减少
- 税收（1%）留在合约里
- 管理员可以从合约里提取代币

# 测试:

在`hardhat环境`测试

- Deployment
    - [x] set the right owner
    - [x] Deployment,total supply = token owner balance

- Transactions
    - [x] tokenOwner ---transfer--> user
    - [x] userA ---transfer--> userB（Fee）,totalsupply`↓`,balance of contract `↑`

- tokenOwner withdraw
    - [x] tokenOwner withdraw from contract After userA to userB

```
  Token contract
    Deployment
      ✔ Should set the right owner (1127ms)
      ✔ Should assign the total supply of tokens to the owner (65ms)
    Transactions
users0Balance: 100.0
      ✔ Should transfer tokens from tokenOwner to user (78ms)
users1ShouldGet: 47.5
totalSupplyBefore: 1000.0
totalSupplyAfter: 998.0
contractBalanceWei: 0.5
contractShouldGet: 0.5
      ✔ Should transfer tokens from user1 to user2 (139ms)
    tokenOwner withdraw from contract
tokenOwnerBalanceWeiBefore: 900.0
contractBalanceWei: 0.5
contractBalanceWeiNow: 0.0
tokenOwnerBalanceWeiAfter: 900.5
tokenOwnerShouldGet: 900.5
      ✔ tokenOwner withdraw from contract (162ms)


  5 passing (2s)

✨  Done in 5.62s.

```