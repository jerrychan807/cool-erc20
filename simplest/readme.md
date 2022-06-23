# 需求:

最少代码的erc20代币

# 测试:

在`hardhat环境`测试

- Transactions
  - [x] can transfer

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
      ✔ can transfer (1141ms)


  1 passing (1s)

✨  Done in 5.33s.
```