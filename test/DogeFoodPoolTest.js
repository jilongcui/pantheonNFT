const fs = require('fs');
// require("../contract/token/ERC20/IERC20");
const ERC721Card = artifacts.require("ERC721Card");
const DogeFoodPool = artifacts.require("DogeFoodPool");
const ERC20DogeFoodToken = artifacts.require("ERC20DogeFoodToken");
const ERC721 = artifacts.require("ERC721");
const ERC20 = artifacts.require("ERC20");
var wait = require('./wait')

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("DogeFoodPool", function (accounts) {
  let nft;
  let nftId;
  let pool;
  let dogeToken;
  // nft = await ERC721PresetMinterPauserAutoId.deployed();
  // const to = accounts[1];
  // await nft.mint(to);

  before(async function () {
    // runs once before the first test in this block
    console.log("before");
    nft = await ERC721Card.deployed();
    pool = await DogeFoodPool.deployed();
    dogeToken = await ERC20DogeFoodToken.deployed();
  });

  after(function () {
    // runs once after the last test in this block
    console.log("after");
  });

  beforeEach(function () {
    // runs before each test in this block
    console.log("beforeEach");
  });

  afterEach(function () {
    // runs after each test in this block
    console.log("afterEach");
  });

  it("Check mint 3 NFTs", async function () {
    const to = accounts[0];
    await nft.mintCard(1, "123", to);
    const owner0 = await nft.ownerOf.call("123");
    assert.equal(owner0, to);

    await nft.mintCard(2, "124", to);
    const owner1 = await nft.ownerOf.call("124");
    assert.equal(owner1, to);

    await nft.mintCard(3, "125", to);
    const owner2 = await nft.ownerOf.call("125");
    assert.equal(owner2, to);
    // return assert.equal(nft.balanceOf(to), 1);
    // const owner0 = await nft.ownerOf.call(0);
    // return assert.equal(owner0, to);
    // const owner0 = await nft.ownerOf.call(0);
    // const uri0 = await nft.tokenURI.call(0);
    // const uri0_1 = 'https://my-json-server.typicode.com/jilongcui/pantheon_json_db/tokens/0';
    // return assert.equal(uri0, uri0_1); //assert.equal(owner0, to) && 
  });

  it("Pool: check Pool deployed", async function () {
    const nftTokenAddress = await pool.nftToken.call();
    assert.equal(nftTokenAddress, nft.address);
  });

  it("Approve a NFT token to Pool contract", async function () {
    let nftId = "123";
    // console.log(c2c.address);
    const tx = await nft.approve(pool.address, nftId);
    const approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, pool.address);

    // inspect the transaction & perform assertions on the logs
    const { logs } = tx;
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);

    const log = logs[0];
    assert.equal(log.event, 'Approval');
    assert.equal(log.args.approved.toString(), pool.address.toString());
    // assert.equal(log.args.atCar.toString(), '1');
  });

  it("Approve 2 NFT tokens to Pool", async function () {
    let nftId = "124";
    // console.log(c2c.address);
    let tx = await nft.approve(pool.address, nftId);
    let approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, pool.address);

    nftId = "125";
    tx = await nft.approve(pool.address, nftId);
    approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, pool.address);

  });

  it("Depsit 3 NFT token to Pool", async function () {
    let nftId1 = "123";
    let nftId2 = "124";
    let nftId3 = "125";
    // nft.approved(nft.address, nftId);
    const tx = await pool.depositWithNFT(0, 7, nftId1, nftId2, nftId3);
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.event, 'DepositWithNFT');
    assert.equal(log.args.nft1.toNumber(), nftId1);
    // assert.equal(c2c.totalItem.call(), totalItem + 1, "C2C total item should should increase one.");
  });

  it("Wait for 10 seconds and update", async function () {
    // nft.approved(nft.address, nftId);
    await wait(10);

    const tx = await pool.updateReward(0);
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    // const log = logs[0];
    // assert.equal(log.event, 'DepositWithNFT');
    // assert.equal(log.args.nft1.toNumber(), nftId1);
    // assert.equal(c2c.totalItem.call(), totalItem+1, "C2C total item should should increase one.");
  });


  it("Withdraw 3 NFT token from Pool", async function () {
    let nftId1 = "123";
    let nftId2 = 2;
    let nftId3 = 3;
    let poolId = 0;
    // nft.approved(nft.address, nftId);
    const tx = await pool.withdraw(poolId, 0);
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.event, 'Withdraw');
    assert.equal(log.args.nft1.toNumber(), nftId1);
    // assert.equal(c2c.totalItem.call(), totalItem+1, "C2C total item should should increase one.");
  });

  it("Set banned address", async function () {
    // nft.approved(nft.address, nftId);
    await wait(10);

    const tx = await pool.setWithdrawBanned(accounts[0]);
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    // const log = logs[0];
    // assert.equal(log.event, 'DepositWithNFT');
    // assert.equal(log.args.nft1.toNumber(), nftId1);
    // assert.equal(c2c.totalItem.call(), totalItem+1, "C2C total item should should increase one.");
  });

  it("Approve 3 NFT tokens to Pool", async function () {

    let nftId = "123";
    // console.log(c2c.address);
    let tx = await nft.approve(pool.address, nftId);
    let approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, pool.address);

    nftId = "124";
    // console.log(c2c.address);
    tx = await nft.approve(pool.address, nftId);
    approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, pool.address);

    nftId = "125";
    tx = await nft.approve(pool.address, nftId);
    approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, pool.address);

  });

  it("Depsit 3 NFT token to Pool for banned account", async function () {
    let nftId1 = "123";
    let nftId2 = "124";
    let nftId3 = "125";
    // nft.approved(nft.address, nftId);
    const tx = await pool.depositWithNFT(0, 7, nftId1, nftId2, nftId3);
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.event, 'DepositWithNFT');
    assert.equal(log.args.nft1.toNumber(), nftId1);
    // assert.equal(c2c.totalItem.call(), totalItem + 1, "C2C total item should should increase one.");
  });

  it("Withdraw 3 NFT token from Pool for banned account", async function () {
    let nftId1 = "123";
    let nftId2 = 2;
    let nftId3 = 3;
    let poolId = 0;
    // nft.approved(nft.address, nftId);
    let tx;
    try {
      tx = await pool.withdraw(poolId, 0);
    } catch (error) {
      // console.log(error);
      const { reason, data } = error;
      console.log(reason);
      // console.log(data);
      assert.equal(reason, "Be banned.");
    }
    console.log(tx);

    // assert.equal(c2c.totalItem.call(), totalItem+1, "C2C total item should should increase one.");
  });

  // it("Approve a pan token to C2C contract", async function () {
  //   const nft = await ERC721PresetMinterPauserAutoId.deployed();
  //   const c2c = await PantheonC2C.deployed();
  //   const tokenAddress = '0x63aA6b76120FBD69EA0ca0Ad61e6E342E2604e52';
  //   // 通过ABI和地址获取已部署的合约对象
  //   var fs = require('fs');
  //   var jsonFile = "./build/contracts/ERC20.json"; // 读取合约 abi 文件
  //   var parsed = JSON.parse(fs.readFileSync(jsonFile));
  //   var abi = parsed.abi;
  //   // var coinContract = web3.eth.contract(abi).at(contractAddress);

  //   let token = new web3.eth.Contract(abi, tokenAddress);
  //   let totalItem = c2c.totalItem.call();
  //   const c2cItem = await c2c.getC2CItem(nftId);
  //   // console.log(c2cItem);
  //   //   const tx = await token.methods.approve(c2c.address, c2cItem.value).send({from: accounts[0]}, async function(error, txHash) {
  //   //     if (error) {
  //   //         console.log("ERC20 could not be approved", error);
  //   //         return;
  //   //     }
  //   //     console.log("ERC20 token approved to " + c2c.address);
  //   //     const status = await waitTransaction(txHash);
  //   //     if (!status) {
  //   //         console.log("Approval transaction failed.");
  //   //         return;
  //   //     }
  //   //     console.log("Approve success.");
  //   //     // callback();
  //   // });
  //   token.methods.approve(c2c.address, c2cItem.value).send({ from: accounts[0] }).on('transactionHash', function (hash) {
  //   })
  //     .on('confirmation', function (confirmationNumber, receipt) {
  //     })
  //     .on('receipt', function (receipt) {
  //       // receipt example
  //       // console.log(receipt); //查询这里可以得到结果
  //     })
  //     .on('error', console.error);
  //   // const approver = nft.getApproved(nftId);
  //   // console.log(approver);
  //   // return assert.equal(approver,c2c.address);

  //   // inspect the transaction & perform assertions on the logs
  //   // const { logs } = tx;
  //   // console.log(logs);
  //   // // assert.ok(Array.isArray(logs));
  //   // assert.equal(logs.length, 1);

  //   // const log = logs[0];
  //   // assert.equal(log.event, 'Approval');
  //   // assert.equal(log.args.approved.toString(), c2c.address.toString());
  //   // assert.equal(log.args.atCar.toString(), '1');
  // });

  // it("Buy a NFT token", async function () {
  //   const c2c = await PantheonC2C.deployed()
  //   let totalItem = c2c.totalItem.call();
  //   const tx = await c2c.buyC2CItem(0);
  //   const { logs } = tx;
  //   // console.log(logs);
  //   assert.ok(Array.isArray(logs));
  //   assert.equal(logs.length, 1);
  //   // return assert(totalItem - c2c.totalItem.call() == 1, "C2C total item should should descrease one.");
  // });

  // it("Down a NFT token", async function () {
  //   let nftId = 1;
  //   const c2c = await PantheonC2C.deployed()
  //   let totalItem = await c2c.getTotalItem();
  //   await c2c.downC2CItem(nftId);
  //   let totalItem2 = await c2c.totalItem.call();
  //   return assert.equal(totalItem - totalItem2, 1, "C2C total item should should descrease one.");
  // });

});
