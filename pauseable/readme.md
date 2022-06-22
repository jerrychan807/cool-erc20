# 需求:

- 管理员可配置暂停开关
- 暂停后无法正常`transfer`
- 解除暂停后可正常`transfer`

# 测试:

在`hardhat环境`测试

- Transactions
  - [x] can't transfer after set pause,can transfer after set Unpause

```
 
  Token contract
    can't transfer after set pause,can transfer after set Unpause
 Before Transfer: 
【Step 1】tokenOwnerBalance(Ether): 1000.0
【Step 1】userBalance(Ether): 0.0
 Transfer: 
【Step 2】tokenOwner -> 100-> user0: 
【Step 2】tokenOwnerBalance(Ether): 900.0
【Step 2】userBalance(Ether): 100.0
 Pause: 
【Step 3】tokenOwner Set Pause: 
【Step 3】paused Switch: true
 After setting pause, try to transfer: 
【Step 4】 expect : tokenOwner -> 100-> user0 to.be.reverted
【Step 4】userBalance(Ether): 100.0
 UnPause: 
【Step 5】tokenOwner Set UnPause: 
【Step 5】paused Switch: false
 After setting Unpause, try to transfer: 
【Step 6】 expect : tokenOwner -> 100-> user0 to be not reverted
【Step 6】userBalance(Ether): 200.0
      ✔  (1446ms)


  1 passing (1s)

✨  Done in 5.12s.

```