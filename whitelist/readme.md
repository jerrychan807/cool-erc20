# 需求:

- 白名单用户才能正常`transfer`
- 管理员可配置白名单里的地址

# 测试:

在`hardhat环境`测试

- Transactions
  - [x] only transfer after setting whiteList
  
```
   Token contract
    Transfer
 Before Transfer: 
【Step 1】tokenOwnerBalance(Ether): 1000.0
【Step 1】userBalance(Ether): 0.0
 Transfer: 
【Step 2】tokenOwner -> 100 -> user0: 
【Step 2】tokenOwnerBalance(Ether): 900.0
【Step 2】userBalance(Ether): 100.0
 Transfer: user0 -> 100-> user1
【Step 3】user0 -> 100-> user1 to be reverted
 Set whiteList: 
【Step 4】tokenOwner Set user0 in WhiteList: 
【Step 4】user0IfwhiteList: true
 After setting whitelist, try to transfer: 
【Step 5】 expect : users[0] -> 100-> user1 to be not reverted
【Step 5】user0Balance(Ether): 0.0
【Step 5】user1Balance(Ether): 100.0
      ✔ only transfer after setting whiteList (1253ms)
  1 passing (1s)

✨  Done in 5.38s.
```