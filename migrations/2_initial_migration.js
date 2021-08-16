// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC721PresetMinterPauserAutoId = artifacts.require("ERC721PresetMinterPauserAutoId");
const PantheonC2C = artifacts.require("PantheonC2C");

module.exports = function(deployer, network, accounts) {
  let tokenAddress = '0x63aA6b76120FBD69EA0ca0Ad61e6E342E2604e52';
  deployer.deploy(ERC721PresetMinterPauserAutoId, "PAN NFT","PANNFT", "https://my-json-server.typicode.com/jilongcui/pantheon_json_db/tokens/").then(function() {
    return deployer.deploy(PantheonC2C, ERC721PresetMinterPauserAutoId.address,tokenAddress); 
  });
};
