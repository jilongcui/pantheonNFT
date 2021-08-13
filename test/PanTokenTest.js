// const { assert } = require("console");

const ERC721PresetMinterPauserAutoId= artifacts.require("ERC721PresetMinterPauserAutoId");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NFT deployed", function (accounts) {
  it("should assert true", async function () {
    const nft = await ERC721PresetMinterPauserAutoId.deployed()
    const name = await nft.name.call();
    const symbol = await nft.symbol.call();

    return assert.equal(name+"_"+symbol, "My NFT_NFT");
  });
  it("NFT mint", async function() {
    const nft = await ERC721PresetMinterPauserAutoId.deployed();
    const to = accounts[1];
    await nft.mint(to);
    const owner0 = await nft.ownerOf.call(0);
    const uri0 = await nft.tokenURI.call(0);
    const uri0_1 = 'https://my-json-server.typicode.com/jilongcui/pantheon_json_db/tokens/0';
    return assert.equal(uri0, uri0_1); //assert.equal(owner0, to) && 
  });
  // it("Test token transfer", async function() {
  //   const contract = await PanToken.deployed();
  //   const initValue = await contract.balanceOf.call(accounts[1]);
  //   await contract.transfer(accounts[1], 100e+6, {from: accounts[0]});
  //   const endValue = await contract.balanceOf.call(accounts[1]);
  //   assert.equal(endValue - initValue, 100e+6);
  // });
});
