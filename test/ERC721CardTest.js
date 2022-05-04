const { fs } = require("fs");

const ERC721PresetMinterPauserAutoId = artifacts.require("ERC721PresetMinterPauserAutoId");
const ERC721Card = artifacts.require("ERC721Card");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NFT deployed", function (accounts) {
  it("should assert true", async function () {
    const nft = await ERC721Card.deployed()
    const name = await nft.name.call();
    const symbol = await nft.symbol.call();

    return assert.equal(symbol, "DOGENFT");
  });
  it("NFT mint", async function () {
    const nft = await ERC721Card.deployed();
    const to = accounts[1];
    await nft.mintWithLevel(1, 0, to);
    const owner0 = await nft.ownerOf.call(0);
    const level = await nft.levelOf.call(0);
    const category = await nft.categoryOf(0);
    // const uri0 = await nft.tokenURI.call(0);
    // const uri0_1 = 'http://api.pantheon.best/tokens/0';
    assert.equal(owner0, to);
    assert.equal(category, 1, "Category is invalid");
    assert.equal(level, 0, "Level is invalid");
  });

  it("NFT mintCard with random level", async function () {
    const nft = await ERC721Card.deployed();
    const to = accounts[1];
    await nft.mintCard(2, to);
    const owner0 = await nft.ownerOf.call(0);
    const level = await nft.levelOf.call(0);
    const category = await nft.categoryOf(0);
    assert.equal(owner0, accounts[1]);
    assert.equal(category, 1, "Category is invalid");
    assert.include([0, 1, 2, 3, 4], level.toNumber(), "Level is invalid")
    await nft.mintCard(2, to);
    const level2 = await nft.levelOf.call(1);

    assert.notEqual(level2, level, "Level should be random");
  });
  // it("Test token transfer", async function() {
  //   const contract = await PanToken.deployed();
  //   const initValue = await contract.balanceOf.call(accounts[1]);
  //   await contract.transfer(accounts[1], 100e+6, {from: accounts[0]});
  //   const endValue = await contract.balanceOf.call(accounts[1]);
  //   assert.equal(endValue - initValue, 100e+6);
  // });
});
