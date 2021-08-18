// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC721PresetMinterPauserAutoId = artifacts.require("ERC721PresetMinterPauserAutoId");
const PantheonC2C = artifacts.require("PantheonC2C");

module.exports = function(deployer, network, accounts) {
  if (network == "testnet")
    tokenAddress = "0x226BAb96eA6e48F2D7e091085d378979a0635e17";
  else
    tokenAddress = '0x63aA6b76120FBD69EA0ca0Ad61e6E342E2604e52';
  console.log(tokenAddress);
  // deployer.deploy(ERC721PresetMinterPauserAutoId, "PAN NFT","PANNFT", "https://my-json-server.typicode.com/jilongcui/pantheon_json_db/tokens/").then(function() {
  deployer.deploy(ERC721PresetMinterPauserAutoId, "PAN NFT","PANNFT", "https://api.pantheon.best/tokens/").then(function() {
    return deployer.deploy(PantheonC2C, ERC721PresetMinterPauserAutoId.address,tokenAddress);
  });
};
