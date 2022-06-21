# 需求:

- 黑名单用户无法正常`transfer`
- 管理员可配置黑白名单里的地址

# 测试:

在`hardhat环境`测试

- Transactions
  - [x] can't transfer after setting blacklist

```
  Token contract
    Transfer
 Before Transfer: 
【Step 1】tokenOwnerBalance(Ether): 1000.0
【Step 1】userBalance(Ether): 0.0
 Transfer: 
【Step 2】tokenOwner -> 100-> user0: 
【Step 2】tokenOwnerBalance(Ether): 900.0
【Step 2】userBalance(Ether): 100.0
 Set blacklist: 
【Step 3】tokenOwner Set user0 in blacklist: 
【Step 3】user0IfBlackList: true
 After setting blacklist, try : 
【Step 4】tokenOwner Set user0 in blacklist and try to transfer: 
【Step 4】 expect : tokenOwner -> 100-> user0 to.be.reverted
【Step 4】userBalance(Ether): 100.0
      ✔ can't transfer after setting blacklist (1351ms)

  1 passing (1s)

```