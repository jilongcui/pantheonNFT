// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC20PresetFixedSupply = artifacts.require("ERC20PresetFixedSupply");
const ERC20DogeFoodToken = artifacts.require("ERC20DogeFoodToken");
const ERC721Card = artifacts.require("ERC721Card");
const DogeFoodBlindBox = artifacts.require("DogeFoodBlindBox");
const DogeFoodPool = artifacts.require("DogeFoodPool");

async function initNFT(network, accounts) {
    let erc721 = await ERC721Card.deployed();
    const MinterRoler = web3.utils.keccak256('MINTER_ROLE')
    await erc721.grantRole(MinterRoler, DogeFoodBlindBox.address);
}

async function initIDO() {
    // Deploy IDO
    let idoStart = toTimestamp("2021-08-19 15:00:00");
    let idoEnd = toTimestamp("2021-08-29 23:00:00");
    let claimStart = toTimestamp("2021-08-23 15:00:00");
    let claimEnd = toTimestamp("2021-11-23 15:00:00");
    await deployer.deploy(PantheonIDO, panToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    let ido = await PantheonIDO.deployed();
    await panToken.transfer(ido.address, web3.utils.toWei("400000"));
}

async function initBlindBox(category, tokenAddress, tokenValue, totalSupply, startTime, endTime) {

    let blindBox = await DogeFoodBlindBox.deployed();
    let erc721Card = await ERC721Card.deployed();
    let pool = await DogeFoodPool.deployed();

    await blindBox.setBBoxInfo(category, erc721Card.address, tokenAddress, tokenValue, totalSupply, startTime, endTime);
    await blindBox.setPoolAddress(pool.address);
    // console.log("BlindBox pid = ", pid);
}

async function initUSDT() {
    console.log("111");
    let usdtToken = await ERC20PresetFixedSupply.deployed();
    await usdtToken.transfer(accounts[1], web3.utils.toWei("10000"));
    await usdtToken.transfer(accounts[7], web3.utils.toWei("10000"));
    await usdtToken.transfer(accounts[8], web3.utils.toWei("10000"));
    await usdtToken.transfer(accounts[9], web3.utils.toWei("10000"));
    await usdtToken.transfer("0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6", web3.utils.toWei("10000"));
    await usdtToken.transfer("0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6", web3.utils.toWei("10000"));
    await usdtToken.transfer("0x95C65C0752b64B8Df8B749Dd096b47c473eba561", web3.utils.toWei("10000"));
}

async function initSoloPool() {
    let pool = await DogeFoodPool.deployed();
    let dogeToken = await ERC20DogeFoodToken.deployed();
    // console.log(token);
    // pool.addPool(rate, token, isLp, dayNum, withUpdate);
    // pool.setInviteEnable(true);
    let chaPerBlock = parseInt(web3.utils.toWei("100000000000000", "Gwei") / 24 / 1200);
    let startBlock = await web3.eth.getBlockNumber();
    let totalReward = "1,000,000,000,000,000,000"
    await pool.addPool(web3.utils.toWei(chaPerBlock.toString()), startBlock.toString(), web3.utils.toWei("1000000000000000000"));
    // await panToken.approve(pool.address, web3.utils.toWei("100"), { from: accounts[1] });
    // await pool.setInvite(accounts[0], { from: accounts[1] });
    // await pool.deposit(0, web3.utils.toWei("100"), { from: accounts[1] });
    // console.log("0-1", web3.utils.fromWei(await pool.pendingReward(0, accounts[1])));
    // await panToken.approve(pool.address, web3.utils.toWei("100"), { from: accounts[1] });
    // await pool.deposit(1, web3.utils.toWei("100"), { from: accounts[1] });
    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // console.log("115");
    // await panToken.approve(pool.address, web3.utils.toWei("100"), { from: accounts[7] });
    // console.log("0-1", web3.utils.fromWei(await pool.pendingReward(0, accounts[1])));
    // // await pool.deposit(0, web3.utils.toWei("100"), {from: accounts[7]});
    // // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await pool.updateReward();

    // // await pool.withdraw(0, web3.utils.toWei("100"), {from: accounts[1]});

    // // Test deposit with nft
    // await pool.updateReward();
    // await panToken.approve(pool.address, web3.utils.toWei("200"), { from: accounts[7] });
    // await usdtToken.approve(pool.address, web3.utils.toWei("50"), { from: accounts[7] });
    // await erc721.approve(pool.address, 7, { from: accounts[7] });
    // await erc721.approve(pool.address, 8, { from: accounts[7] });
    // await erc721.approve(pool.address, 9, { from: accounts[7] });
    // await pool.depositWithNFT(6, web3.utils.toWei("200"), 7, 8, 9, { from: accounts[7] });
    // await pool.updateReward();
    // console.log("ownerOf", await erc721.ownerOf(7));
    // console.log("ownerOf", await erc721.ownerOf(8));
    // console.log("ownerOf", await erc721.ownerOf(9));
    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));

    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await pool.updateReward();
    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await panToken.transfer(accounts[1], web3.utils.toWei("100"));
    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // // await sleep(5000);
    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // usdtToken.transfer(accounts[1], web3.utils.toWei("120"));
    // console.log("0-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // console.log("1-1", web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));

    // console.log(await pool.withdraw(6, web3.utils.toWei("200"), { from: accounts[7] }));
    // console.log("ownerOf-2", await erc721.ownerOf(7));
    // console.log("ownerOf-2", await erc721.ownerOf(8));
    // console.log("ownerOf-2", await erc721.ownerOf(9));

    // await panToken.approve(pool.address, web3.utils.toWei("400"), { from: accounts[7] });
    // await usdtToken.approve(pool.address, web3.utils.toWei("100"), { from: accounts[7] });
    // await erc721.approve(pool.address, 7, { from: accounts[7] });
    // await erc721.approve(pool.address, 8, { from: accounts[7] });
    // // await erc721.approve(pool.address, 9, {from: accounts[7]});
    // await pool.depositWithNFT(6, web3.utils.toWei("200"), 7, 8, 0, { from: accounts[7] });
}

async function initC2C() {
    let c2c = await PantheonC2C.deployed();
    await erc721.approve(c2c.address, '1');
    await erc721.approve(c2c.address, '2');
    await erc721.approve(c2c.address, '3');
    await erc721.approve(c2c.address, '4');
    await c2c.depositC2CItem('1', web3.utils.toWei("100"));
    await c2c.depositC2CItem('2', web3.utils.toWei("120"));
    await c2c.depositC2CItem('3', web3.utils.toWei("130"));
    await c2c.depositC2CItem('4', web3.utils.toWei("140"));
    await panToken.approve(c2c.address, web3.utils.toWei("100"), { from: accounts[7] });
    await c2c.buyC2CItem('1', { from: accounts[7] });
    await panToken.approve(c2c.address, web3.utils.toWei("120"), { from: accounts[9] });
    await c2c.buyC2CItem('2', { from: accounts[9] });
    await c2c.downC2CItem('4');
}

async function initDogeFoodToken() {
    let dogeToken = await ERC20DogeFoodToken.deployed();
    console.log(dogeToken.address);
    await dogeToken.transfer(accounts[1], web3.utils.toWei("20000000000000"));
    // await dogeToken.transfer("0x6c6B336E3DC3Dd4E75F5F47a74be1A75Ab546807", web3.utils.toWei("2000000000000"));
    // await dogeToken.transfer("0xEe0d65564F100E3dDB1DfF57c6aDb2d3D44315fD", web3.utils.toWei("2000000000000"));
    // await dogeToken.transfer("0x1D571979cd5FebF7820Ac8D8c75F3D2E2E8d82eF", web3.utils.toWei("2000000000000"));
    // console.log("114");
}

function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}

module.exports = async function (deployer, network, accounts) {
    await initNFT(network, accounts);
    // await initUSDT(network, accounts);
    await initSoloPool(network, accounts)
    let zeroAddress = "0x0000000000000000000000000000000000000000";
    let dogeToken = await ERC20DogeFoodToken.deployed();
    let startTime = toTimestamp("2021-08-19 15:00:00");
    let endTime = toTimestamp("2022-08-29 23:00:00");
    let totalSupply = 1000;

    // Init dogefood token
    await initDogeFoodToken();

    // Init token and price

    tokenAddress = dogeToken.address; // DogeFood Address
    tokenValue = web3.utils.toWei("20", "Gwei"); // $0.00000000000269484
    await initBlindBox(1, tokenAddress, tokenValue, totalSupply, startTime, endTime);
    tokenValue = web3.utils.toWei("15", "Gwei"); // $0.00000000000269484
    await initBlindBox(2, tokenAddress, tokenValue, totalSupply, startTime, endTime);
    tokenValue = web3.utils.toWei("0.0035"); // 0.35 BNB
    await initBlindBox(3, zeroAddress, tokenValue, totalSupply, startTime, endTime);
}