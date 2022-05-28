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
contract("DogeFoodInvite", function (accounts) {
  let nft;
  let inviter;
  let dogeToken;
  // nft = await ERC721PresetMinterPauserAutoId.deployed();
  // const to = accounts[1];
  // await nft.mint(to);

  before(async function () {
    // runs once before the first test in this block
    console.log("before");
    inviter = await DogeFoodPool.deployed();
    nft = await ERC721Card.deployed();
    dogeToken = await ERC20DogeFoodToken.deployed();
    await inviter.setOneDayBlock(1);
    await inviter.setUpdatePerDay(1);
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

  // it("Inviter: check conract deployed", async function () {
  //   // const nftTokenAddress = await pool.nftToken.call();
  //   assert.equal(inviter.isForce, false);
  // });

  it("Check isForce", async function () {
    const isForce = await inviter.isForceInvite();
    assert.equal(isForce, false);
  });

  it("Check isInvited", async function () {
    const to = accounts[0];
    const isInvited = await inviter.isInvited(to);
    assert.equal(isInvited, false);
  });

  it("Check invite operation", async function () {
    const parent = accounts[0];
    const child = accounts[1];
    // console.log(c2c.address);
    const tx = await inviter.setInvite(parent, { from: child });
    // inspect the transaction & perform assertions on the logs
    const { logs } = tx;
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);

    const log = logs[0];
    assert.equal(log.event, 'InviteUser');
    assert.equal(log.args.parent, parent);
  });

  it("Check invite parent", async function () {
    const parent = accounts[0];
    const child = accounts[1];
    const myParent = await inviter.getParent(child);
    assert.equal(myParent, parent);
  });

  it("Check reset invite parent", async function () {
    const parent = accounts[0];
    const child = accounts[1];
    const tx = await inviter.resetInvite(child);
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.event, 'InviteUser');
    assert.equal(log.args.parent, "0x0000000000000000000000000000000000000000");
    // assert.equal(c2c.totalItem.call(), totalItem + 1, "C2C total item should should increase one.");
  });

  it("Check invite multi level", async function () {
    const parent = accounts[0];
    const child1 = accounts[1];
    const child2 = accounts[2];
    await inviter.setInvite(parent, { from: child1 });
    const myParent1 = await inviter.getParent(child1);
    assert.equal(myParent1, parent);
    await inviter.setInvite(child1, { from: child2 });
    const myParent2 = await inviter.getParent(child2);
    assert.equal(myParent2, child1);
  });

  it("Check mint 3 NFTs", async function () {
    const to = accounts[2];
    await nft.mintCard(1, "123", to);
    const owner0 = await nft.ownerOf.call("123");
    assert.equal(owner0, to);

    await nft.mintCard(2, "124", to);
    const owner1 = await nft.ownerOf.call("124");
    assert.equal(owner1, to);

    await nft.mintWithLevel(3, "125", 4, to);
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

  it("Check group power is reset", async function () {
    parent = accounts[0];
    child = accounts[1];
    child2 = accounts[2];
    const parentPower = await inviter.getGroupPower(parent);
    const child1Power = await inviter.getGroupPower(child);
    const child2Power = await inviter.getGroupPower(child2);
    assert.equal(parentPower, 0);
    assert.equal(child1Power, 0);
    assert.equal(child2Power, 0);

  });

  it("Approve 3 NFT tokens to Pool", async function () {
    let nftId = "123";
    // console.log(c2c.address);
    let tx = await nft.approve(inviter.address, nftId, { from: child2 });
    let approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, inviter.address);

    nftId = "124";
    tx = await nft.approve(inviter.address, nftId, { from: child2 });
    approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, inviter.address);

    nftId = "125";
    tx = await nft.approve(inviter.address, nftId, { from: child2 });
    approver = await nft.getApproved(nftId);
    // console.log(approver);
    assert.equal(approver, inviter.address);

  });

  it("Check up group power", async function () {
    parent = accounts[0];
    child = accounts[1];
    child2 = accounts[2];
    // const tx = await inviter.upGroupPower(child2, 500);
    // const { logs } = tx;
    // console.log(logs);
    // assert.ok(Array.isArray(logs));
    // assert.equal(logs.length, 1);
    // const log = logs[s0];
    // assert.equal(log.event, 'UpGroupPower');

    let nftId1 = "123";
    let nftId2 = "124";
    let nftId3 = "125";
    let countday = 7;
    // nft.approved(nft.address, nftId);
    const tx = await debug(inviter.depositWithNFT(0, countday, nftId1, nftId2, nftId3, { from: child2 }));
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 4);
    console.log(logs);
    const log = logs[3];
    assert.equal(logs[0].event, 'UpGroupPower');
    assert.equal(logs[1].event, 'UpGroupPower');
    assert.equal(logs[2].event, 'UpGroupPower');
    assert.equal(logs[3].event, 'DepositWithNFT');
    assert.equal(log.args.nft1.toNumber(), nftId1);
    let power = web3.utils.toNumber(await nft.powerOf(nftId1));
    power += web3.utils.toNumber(await nft.powerOf(nftId2));
    power += web3.utils.toNumber(await nft.powerOf(nftId3));
    power = power * (countday + 100) / (100);
    console.log(power);
    const parentPower_1 = await inviter.getGroupPower(parent);
    const child1Power_1 = await inviter.getGroupPower(child);
    const child2Power_1 = await inviter.getGroupPower(child2);
    assert.equal(parseInt(power * (1) / 100), parentPower_1);
    assert.equal(parseInt(power * (2) / 100), child1Power_1);
    assert.equal(parseInt(power * (2) / 100), child2Power_1);
  });

  it("Wait for 8 block update", async function () {
    // nft.approved(nft.address, nftId);
    for (let i = 0; i < 8; i++) {
      await wait(4);
      const poolInfo = await inviter.poolInfo(0);
      // console.log(poolInfo);
      const tx = await inviter.updateReward(0);
      const { logs } = tx;
      // console.log(tx);
      assert.ok(Array.isArray(logs));
      assert.equal(logs.length, 1);
      const log = logs[0];
      assert.equal(log.event, 'UpdateReward');
    }
  });

  it("Check down group power", async function () {
    parent = accounts[0];
    child = accounts[1];
    child2 = accounts[2];

    // const tx = await inviter.downGroupPower(child2, 500);
    // const { logs } = tx;
    // console.log(logs);
    // assert.ok(Array.isArray(logs));
    // assert.equal(logs.length, 1);
    // const log = logs[0];
    // assert.equal(log.event, 'DownGroupPower');
    // assert.equal(log.args.nft1.toNumber(), nftId1);

    let nftId1 = "123";
    let nftId2 = "124";
    let nftId3 = "125";

    const tx = await inviter.withdraw(0, 0, { from: child2 });
    const { logs } = tx;
    console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 4);
    const log = logs[3];
    assert.equal(log.event, 'Withdraw');
    assert.equal(log.args.nft1.toNumber(), nftId1);
    let power = await nft.powerOf(nftId1);
    power += await nft.powerOf(nftId2);
    power += await nft.powerOf(nftId3);

    const parentPower_1 = await inviter.getGroupPower(parent);
    const child1Power_1 = await inviter.getGroupPower(child);
    const child2Power_1 = await inviter.getGroupPower(child2);
    assert.equal(0, parentPower_1)
    assert.equal(0, child1Power_1)
    assert.equal(0, child2Power_1)
  });

});
