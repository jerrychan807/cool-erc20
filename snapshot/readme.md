# 需求:

代币发生转移时，以当前区块数做快照id,记录发生转移前的用户余额或代币供应量。

# 测试:

在`hardhat环境`测试

- Transfer:
    - [x] Check UserBalance snapshot
- Burn:
    - [x] Check totalsupply snapshot

```bash
  Token contract
    Transactions
 Before Transfer: 
【Step 1】tokenOwnerBalance(Ether): 1000.0
【Step 1】userBalance(Ether): 0.0
 Transfer: 
【Step 2】tokenOwner -> 100-> user0: 
【Step 2】blockNum When tx confirmed: 2
【Step 2】tokenOwnerBalance(Ether): 900.0
【Step 2】userBalance(Ether): 100.0
 Check Snapshot: 
【Step 3】tokenOwnerBalance(Ether) AtSnapshot: 1000.0  BlockNum :2
【Step 3】userBalance(Ether) AtSnapshot: 0.0  BlockNum :2
 Transfer again: 
【Step 4】tokenOwner -> 100-> user0: 
【Step 4】blockNum When tx confirmed: 3
【Step 4】tokenOwnerBalance(Ether): 800.0
【Step 4】userBalance(Ether): 200.0
 Check Snapshot: 
【Step 5】tokenOwnerBalance(Ether) AtSnapshot: 900.0  BlockNum :3
【Step 5】userBalance(Ether) AtSnapshot: 100.0  BlockNum :3
      ✔ Check snapshotId和users balance (1468ms)
    Burn
 Before burn : 
【Step 1】tokenOwnerBalance(Ether): 1000.0
【Step 1】totalSupplyWeiBefore(Ether): 1000.0
 tokenOwner Burn 100Ether token: 
【Step 2】blockNum When tx confirmed: 2
【Step 2】tokenOwnerBalanceWei(Ether): 900.0
【Step 2】totalSupplyWei(Ether): 900.0
 Check Snapshot: 
【Step 3】tokenOwnerBalance(Ether) AtSnapshot: 1000.0  BlockNum :2
【Step 3】totalSupply(Ether) AtSnapshot: 1000.0  BlockNum :2
 tokenOwner Burn 100Ether token Again: 
【Step 4】blockNum When tx confirmed: 3
【Step 4】tokenOwnerBalanceWei(Ether): 800.0
【Step 4】totalSupplyWei(Ether): 800.0
 Check Snapshot Again: 
【Step 5】tokenOwnerBalance(Ether) AtSnapshot: 900.0  BlockNum :3
【Step 5】totalSupply(Ether) AtSnapshot: 900.0  BlockNum :3
      ✔ Burn, check Snapshot totalsupply (241ms)

  2 passing (2s)

✨  Done in 9.05s.

```