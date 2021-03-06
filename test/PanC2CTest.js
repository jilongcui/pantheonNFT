// const { assert } = require("console");
const fs = require('fs');
// require("../contract/token/ERC20/IERC20");
const ERC721PresetMinterPauserAutoId= artifacts.require("ERC721PresetMinterPauserAutoId");
const PantheonC2C= artifacts.require("PantheonC2C");
const ERC721= artifacts.require("ERC721");
const ERC20= artifacts.require("ERC20");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("PantheonC2C", function (accounts) {
  let nft;
  let nftId;
  // nft = await ERC721PresetMinterPauserAutoId.deployed();
  // const to = accounts[1];
  // await nft.mint(to);

  it("should assert true", async function () {
    const nft = await ERC721PresetMinterPauserAutoId.deployed()
    const name = await nft.name.call();
    const symbol = await nft.symbol.call();
    nftId = 0;

    return assert.equal(name+"_"+symbol, "PAN NFT_PANNFT");
  });

  it("Check deploy two NFT deployed", async function() {
    nft = await ERC721PresetMinterPauserAutoId.deployed();
    const to = accounts[0];
    await nft.mint(to);
    const owner0 = await nft.ownerOf.call(0);
    assert.equal(owner0, to);

    await nft.mint(to);
    const owner1 = await nft.ownerOf.call(1);
    assert.equal(owner1, to);
    // return assert.equal(nft.balanceOf(to), 1);
    // const owner0 = await nft.ownerOf.call(0);
    // return assert.equal(owner0, to);
    // const owner0 = await nft.ownerOf.call(0);
    // const uri0 = await nft.tokenURI.call(0);
    // const uri0_1 = 'https://my-json-server.typicode.com/jilongcui/pantheon_json_db/tokens/0';
    // return assert.equal(uri0, uri0_1); //assert.equal(owner0, to) && 
  });

  it("C2C: check C2C deployed", async function () {
    const c2c = await PantheonC2C.deployed()
    const c2cEnabled = await c2c.c2cEnabled.call();
    const totalItem = await c2c.totalItem.call();
    assert.equal(c2cEnabled, true);
    return assert.equal(totalItem, 0);
  });

  it("Approve a NFT token to C2C contract", async function() {
    const nft = await ERC721PresetMinterPauserAutoId.deployed()
    const c2c = await PantheonC2C.deployed()
    let nftId = 0;
    // console.log(c2c.address);
    let totalItem = c2c.totalItem.call();
    const tx = await nft.approve(c2c.address, nftId);
    // const approver = nft.getApproved(nftId);
    // console.log(approver);
    // return assert.equal(approver,c2c.address);

    // inspect the transaction & perform assertions on the logs
    const { logs } = tx;
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);

    const log = logs[0];
    assert.equal(log.event, 'Approval');
    assert.equal(log.args.approved.toString(), c2c.address.toString());
    // assert.equal(log.args.atCar.toString(), '1');
  });

  it("Depsit a NFT token", async function() {
    const c2c = await PantheonC2C.deployed()
    let totalItem = c2c.totalItem.call();
    let nftId = 0;
    // nft.approved(nft.address, nftId);
    const tx = await c2c.depositC2CItem(nftId, 1e+6);
    const { logs } = tx;
    // console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.event, 'C2CDepositItemEvent');
    assert.equal(log.args.nftId.toNumber(), nftId);
    // assert.equal(c2c.totalItem.call(), totalItem+1, "C2C total item should should increase one.");
  });

  it("Approve a NFT token to C2C contract", async function() {
    const nft = await ERC721PresetMinterPauserAutoId.deployed()
    const c2c = await PantheonC2C.deployed()
    let nftId = 1;
    // console.log(c2c.address);
    let totalItem = c2c.totalItem.call();
    const tx = await nft.approve(c2c.address, nftId);
    // const approver = nft.getApproved(nftId);
    // console.log(approver);
    // return assert.equal(approver,c2c.address);

    // inspect the transaction & perform assertions on the logs
    const { logs } = tx;
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);

    const log = logs[0];
    assert.equal(log.event, 'Approval');
    assert.equal(log.args.approved.toString(), c2c.address.toString());
    // assert.equal(log.args.atCar.toString(), '1');
  });

  it("Depsit another NFT token", async function() {
    const c2c = await PantheonC2C.deployed()
    let totalItem = c2c.totalItem.call();
    let nftId = 1;
    // nft.approved(nft.address, nftId);
    const tx = await c2c.depositC2CItem(nftId, 1e+6);
    const { logs } = tx;
    // console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.event, 'C2CDepositItemEvent');
    assert.equal(log.args.nftId.toNumber(), nftId);
    // assert.equal(c2c.totalItem.call(), totalItem+1, "C2C total item should should increase one.");
  });

  it("Approve a pan token to C2C contract", async function() {
    const nft = await ERC721PresetMinterPauserAutoId.deployed();
    const c2c = await PantheonC2C.deployed();
    const tokenAddress = '0x63aA6b76120FBD69EA0ca0Ad61e6E342E2604e52';
    // ??????ABI???????????????????????????????????????
    var fs = require('fs');
    var jsonFile = "./build/contracts/ERC20.json"; // ???????????? abi ??????
    var parsed= JSON.parse(fs.readFileSync(jsonFile));
    var abi = parsed.abi;
    // var coinContract = web3.eth.contract(abi).at(contractAddress);

    let token = new web3.eth.Contract(abi, tokenAddress);
    let totalItem = c2c.totalItem.call();
    const c2cItem = await c2c.getC2CItem(nftId);
    // console.log(c2cItem);
  //   const tx = await token.methods.approve(c2c.address, c2cItem.value).send({from: accounts[0]}, async function(error, txHash) {
  //     if (error) {
  //         console.log("ERC20 could not be approved", error);
  //         return;
  //     }
  //     console.log("ERC20 token approved to " + c2c.address);
  //     const status = await waitTransaction(txHash);
  //     if (!status) {
  //         console.log("Approval transaction failed.");
  //         return;
  //     }
  //     console.log("Approve success.");
  //     // callback();
  // });
  token.methods.approve(c2c.address, c2cItem.value).send({from: accounts[0]}).on('transactionHash', function(hash){
  })
  .on('confirmation', function(confirmationNumber, receipt){
  })
  .on('receipt', function(receipt){
      // receipt example
      // console.log(receipt); //??????????????????????????????
  })
  .on('error', console.error);
    // const approver = nft.getApproved(nftId);
    // console.log(approver);
    // return assert.equal(approver,c2c.address);

    // inspect the transaction & perform assertions on the logs
    // const { logs } = tx;
    // console.log(logs);
    // // assert.ok(Array.isArray(logs));
    // assert.equal(logs.length, 1);

    // const log = logs[0];
    // assert.equal(log.event, 'Approval');
    // assert.equal(log.args.approved.toString(), c2c.address.toString());
    // assert.equal(log.args.atCar.toString(), '1');
  });

  it("Buy a NFT token", async function() {
    const c2c = await PantheonC2C.deployed()
    let totalItem = c2c.totalItem.call();
    const tx = await c2c.buyC2CItem(0);
    const { logs } = tx;
    // console.log(logs);
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);
    // return assert(totalItem - c2c.totalItem.call() == 1, "C2C total item should should descrease one.");
  });

  it("Down a NFT token", async function() {
    let nftId = 1;
    const c2c = await PantheonC2C.deployed()
    let totalItem = await c2c.getTotalItem();
    await c2c.downC2CItem(nftId);
    let totalItem2 = await c2c.totalItem.call();
    return assert.equal(totalItem - totalItem2, 1, "C2C total item should should descrease one.");
  });

});
