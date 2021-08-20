// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC721Card = artifacts.require("ERC721Card");
const PantheonC2C = artifacts.require("PantheonC2C");
const PantheonPool = artifacts.require("PantheonPool");

module.exports = function(deployer, network, accounts) {
  if (network == "development") {
    _panAddress = "0x226BAb96eA6e48F2D7e091085d378979a0635e17";
    _usdtAddress = "0x226BAb96eA6e48F2D7e091085d378979a0635e17";
  } if (network == "testnet") {
    _panAddress = '0x63aA6b76120FBD69EA0ca0Ad61e6E342E2604e52';
    _usdtAddress = "0x226BAb96eA6e48F2D7e091085d378979a0635e17";
  } if (network == "bsc") {
    _panAddress = '0x63aA6b76120FBD69EA0ca0Ad61e6E342E2604e52';
    _usdtAddress = "0x226BAb96eA6e48F2D7e091085d378979a0635e17";
  }

  console.log(_panAddress);
  // deployer.deploy(ERC721PresetMinterPauserAutoId, "PAN NFT","PANNFT", "https://my-json-server.typicode.com/jilongcui/pantheon_json_db/tokens/").then(function() {
  deployer.deploy(ERC721Card, "PAN NFT","PANNFT", "https://api.pantheon.best/tokens/").then(function() {
    deployer.deploy(PantheonC2C, ERC721Card.address, _panAddress);
    // chaPerBlock = 50000/24/1200 x 10**6
    deployer.deploy(PantheonPool, _panAddress, ERC721Card.address, 1, 0, 1.736111e6);
  });
};
