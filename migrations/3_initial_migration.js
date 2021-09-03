// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC20PresetFixedSupply = artifacts.require("ERC20PresetFixedSupply");
// const ERC20PanToken = artifacts.require("ERC20PanToken");
// const ERC721Card = artifacts.require("ERC721Card");
// const ERC20 = artifacts.require("ERC20");
// const PantheonC2C = artifacts.require("PantheonC2C");
// const PantheonPool = artifacts.require("PantheonPool");
const PantheonInviteReward = artifacts.require("PantheonInviteReward");

module.exports = async function(deployer, network, accounts) {
    // Deploy IDO
    // let idoStart = toTimestamp("2021-08-10 15:00:00");
    // let idoEnd = toTimestamp("2021-08-20 23:00:00");
    // let claimStart = toTimestamp("2021-08-26 15:00:00");
    // let claimEnd = toTimestamp("2021-11-23 15:00:00");
    // let preIDOAddress = "0xd7F6344E257681a90e138201E2290A4F8F2a2C57";
    // let panTokenAddress = "0x7A6d476fCfFA23280537bC9850Cb47bf07EaB7d1";
    // let beneficancy = "0x2d6D02A42CB933c5Fb339cC79837b1b0Ef4fab34";
    // await deployer.deploy(PanIdo2Contract, preIDOAddress, panTokenAddress, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    // let ido = await PanIdo2Contract.deployed();
    // await panToken.transfer(ido.address, web3.utils.toWei("400000"));

    // We first deploy some ERC20 token
    // await deployer.deploy(ERC20PresetFixedSupply, "PANTest Token","PANTES", 1000000, accounts[0]);
    // let usdtToken = await ERC20PresetFixedSupply.deployed();
    // Then we should deploy a InviteReward contract.
    let tokenAddress = "0x7A6d476fCfFA23280537bC9850Cb47bf07EaB7d1";
    let poolAddress = "0x4FC87271bf90Cca19a707343952Cff84874Fa02a";
    await deployer.deploy(PantheonInviteReward, tokenAddress, poolAddress);
    let inviteReward = await PantheonInviteReward.deployed();
    // Then we should transfer some ERC20 to InviteReward
    // await usdtToken.transfer(inviteReward.address, web3.utils.toWei("100000"));
    // Then we can try claim from this.
    let claimInfo = await inviteReward.getClaimInfo("0xd18D11BED5C2367C07116Da90c7BeBDfb4BF76A5");
    console.log(claimInfo);
    // inviteReward.claimFromInvite(web3.utils.toWei("128"));
    // console.log("1123");
    // inviteReward.claimFromInvite(web3.utils.toWei("130"), {from: "0xd18D11BED5C2367C07116Da90c7BeBDfb4BF76A5"});
    // console.log("2356");
}