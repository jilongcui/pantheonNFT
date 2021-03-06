// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC20PresetFixedSupply = artifacts.require("ERC20PresetFixedSupply");
const ERC20PanToken = artifacts.require("ERC20PanToken");
const ERC721Card = artifacts.require("ERC721Card");
const PantheonIDO = artifacts.require("PantheonIDO");
// const ERC20 = artifacts.require("ERC20");
const PantheonC2C = artifacts.require("PantheonC2C");
const PantheonPool = artifacts.require("PantheonPool");
const PantheonInviteReward = artifacts.require("PantheonInviteReward");

const sleep = (timeout) => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    }, timeout)
  })
}

module.exports = async function(deployer, network, accounts) {
  // Deploy A, then deploy B, passing in A's newly deployed address
  let blackHoleAddress = "0x000000000000000000000000000000000000dEaD";
  let airdropAddress = accounts[4];
  let beneficancy = accounts[5];

  let WBNB = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
  let WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
  let PancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

  if (network == "develop") {
    pancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    // airdropAddress = accounts[1];
    await deployer.deploy(ERC721Card, "PAN NFT","PANNFT", "https://api.pantheon.best/tokens/");
    let erc721 = await ERC721Card.deployed();
    await erc721.mintWithLevel(0, accounts[0]);
    await erc721.mintWithLevel(1, accounts[0]);
    await erc721.mintWithLevel(2, accounts[0]);
    await erc721.mintWithLevel(3, accounts[0]);
    await erc721.mintWithLevel(4, accounts[0]);

    await erc721.mintWithLevel(0, accounts[7]);
    await erc721.mintWithLevel(1, accounts[7]);
    await erc721.mintWithLevel(2, accounts[7]);
    await erc721.mintWithLevel(3, accounts[7]);
    await erc721.mintWithLevel(4, accounts[7]);

    await erc721.mintWithLevel(0, accounts[8]);
    await erc721.mintWithLevel(1, accounts[8]);
    await erc721.mintWithLevel(2, accounts[8]);
    await erc721.mintWithLevel(3, accounts[8]);
    await erc721.mintWithLevel(4, accounts[8]);

    await erc721.mintWithLevel(0, accounts[9]);
    await erc721.mintWithLevel(1, accounts[9]);
    await erc721.mintWithLevel(2, accounts[9]);
    await erc721.mintWithLevel(3, accounts[9]);
    await erc721.mintWithLevel(4, accounts[9]);

    console.log((await erc721.balanceOf(accounts[0])).toNumber());
    console.log((await erc721.balanceOf(accounts[1])).toNumber());
    console.log((await erc721.balanceOf(accounts[7])).toNumber());
    console.log((await erc721.balanceOf(accounts[9])).toNumber());
    console.log("110");
    await deployer.deploy(ERC20PresetFixedSupply, "USDT Token","USDT", 1000000, accounts[0]);
    console.log("111");
    let usdtToken = await ERC20PresetFixedSupply.deployed();
    await usdtToken.transfer(accounts[1], web3.utils.toWei("10000"));
    await usdtToken.transfer(accounts[7], web3.utils.toWei("10000"));
    await usdtToken.transfer(accounts[8], web3.utils.toWei("10000"));
    await usdtToken.transfer(accounts[9], web3.utils.toWei("10000"));
    await usdtToken.transfer("0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6", web3.utils.toWei("10000"));
    await usdtToken.transfer("0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6", web3.utils.toWei("10000"));
    await usdtToken.transfer("0x95C65C0752b64B8Df8B749Dd096b47c473eba561", web3.utils.toWei("10000"));

    console.log(erc721.address);
    console.log(airdropAddress);
    console.log(blackHoleAddress);

    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
    await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);
    let panToken = await ERC20PanToken.deployed();
    console.log(panToken.address);
    await panToken.transfer(accounts[1], web3.utils.toWei("20000"));
    await panToken.transfer(accounts[7], web3.utils.toWei("20000"));
    await panToken.transfer(accounts[8], web3.utils.toWei("20000"));
    await panToken.transfer(accounts[9], web3.utils.toWei("20000"));

    await panToken.transfer("0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6", web3.utils.toWei("10000"));
    await panToken.transfer("0x95C65C0752b64B8Df8B749Dd096b47c473eba561", web3.utils.toWei("10000"));
    console.log("114");

    // Deploy IDO
    let idoStart = toTimestamp("2021-08-19 15:00:00");
    let idoEnd = toTimestamp("2021-08-29 23:00:00");
    let claimStart = toTimestamp("2021-08-23 15:00:00");
    let claimEnd = toTimestamp("2021-11-23 15:00:00");
    await deployer.deploy(PantheonIDO, panToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    let ido = await PantheonIDO.deployed();
    await panToken.transfer(ido.address, web3.utils.toWei("400000"));

    // console.log((await panToken.balanceOf(accounts[1])).toNumber());
    // let _panAddress = "0x9fddDFcC89a75C977420A77dae14Cb013f5326E6";
    let erc20 = await ERC20PresetFixedSupply.deployed();
    console.log("112");
    await erc20.transfer(accounts[1], web3.utils.toWei("10000") );
    console.log("113");
    console.log(web3.utils.fromWei(await erc20.balanceOf(accounts[1])));
    await deployer.deploy(PantheonC2C, ERC721Card.address, panToken.address);

    let c2c = await PantheonC2C.deployed();
    await erc721.approve(c2c.address, '1');
    await erc721.approve(c2c.address, '2');
    await erc721.approve(c2c.address, '3');
    await erc721.approve(c2c.address, '4');
    await c2c.depositC2CItem('1', web3.utils.toWei("100"));
    await c2c.depositC2CItem('2', web3.utils.toWei("120"));
    await c2c.depositC2CItem('3', web3.utils.toWei("130"));
    await c2c.depositC2CItem('4', web3.utils.toWei("140"));
    await panToken.approve(c2c.address, web3.utils.toWei("100"), {from: accounts[7]});
    await c2c.buyC2CItem('1', {from: accounts[7]});
    await panToken.approve(c2c.address, web3.utils.toWei("120"), {from: accounts[9]});
    await c2c.buyC2CItem('2', {from: accounts[9]});
    await c2c.downC2CItem('4');

    chaPerBlock = web3.utils.toWei("50000")/24/1200;
    await deployer.deploy(PantheonPool, panToken.address, ERC20PresetFixedSupply.address, ERC721Card.address, beneficancy, web3.utils.toWei("1.736111"), 0, web3.utils.toWei("10000000"));
    let pool = await PantheonPool.deployed();
    // console.log(token);
    // pool.addPool(rate, token, isLp, dayNum, withUpdate);
    pool.setInviteEnable(true);
    await pool.addPool(1500, panToken.address, false, 3*24*1200, false);
    await pool.addPool(3750, panToken.address, false, 7*24*1200, false);
    await pool.addPool(9375, panToken.address, false, 15*24*1200, false);
    await pool.addPool(23437, panToken.address, false, 30*24*1200, false);
    await pool.addPool(58592, panToken.address, false, 60*24*1200, false);
    await pool.addPool(117185, panToken.address, false, 90*24*1200, false);

    await pool.addPool(1000, panToken.address, true, 3*24*1200, false);
    await pool.addPool(2500, panToken.address, true, 7*24*1200, false);
    await pool.addPool(6250, panToken.address, true, 15*24*1200, false);
    await pool.addPool(15625, panToken.address, true, 30*24*1200, false);
    await pool.addPool(39062, panToken.address, true, 60*24*1200, false);
    await pool.addPool(78125, panToken.address, true, 90*24*1200, false);

    await panToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[1]});
    await pool.setInvite(accounts[0],{from: accounts[1]});
    await pool.deposit(0, web3.utils.toWei("100"), {from: accounts[1]});
    console.log("0-1",web3.utils.fromWei(await pool.pendingReward(0, accounts[1])));
    await panToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[1]});
    await pool.deposit(1, web3.utils.toWei("100"), {from: accounts[1]});
    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    console.log("115");
    await panToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[7]});
    console.log("0-1",web3.utils.fromWei(await pool.pendingReward(0, accounts[1])));
    // await pool.deposit(0, web3.utils.toWei("100"), {from: accounts[7]});
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    await pool.updateReward();

    // await pool.withdraw(0, web3.utils.toWei("100"), {from: accounts[1]});

    // Test deposit with nft
    await pool.updateReward();
    await panToken.approve(pool.address, web3.utils.toWei("200"), {from: accounts[7]});
    await usdtToken.approve(pool.address, web3.utils.toWei("50"), {from: accounts[7]});
    await erc721.approve(pool.address, 7, {from: accounts[7]});
    await erc721.approve(pool.address, 8, {from: accounts[7]});
    await erc721.approve(pool.address, 9, {from: accounts[7]});
    await pool.depositWithNFT(6, web3.utils.toWei("200"), 7, 8, 9, {from: accounts[7]});
    await pool.updateReward();
    console.log("ownerOf", await erc721.ownerOf(7));
    console.log("ownerOf", await erc721.ownerOf(8));
    console.log("ownerOf", await erc721.ownerOf(9));
    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));

    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    await pool.updateReward();
    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    await panToken.transfer(accounts[1], web3.utils.toWei("100") );
    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await sleep(5000);
    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    usdtToken.transfer(accounts[1], web3.utils.toWei("120"));
    console.log("0-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));

    console.log(await pool.withdraw(6, web3.utils.toWei("200"), {from: accounts[7]}));
    console.log("ownerOf-2", await erc721.ownerOf(7));
    console.log("ownerOf-2", await erc721.ownerOf(8));
    console.log("ownerOf-2", await erc721.ownerOf(9));

    await panToken.approve(pool.address, web3.utils.toWei("400"), {from: accounts[7]});
    await usdtToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[7]});
    await erc721.approve(pool.address, 7, {from: accounts[7]});
    await erc721.approve(pool.address, 8, {from: accounts[7]});
    // await erc721.approve(pool.address, 9, {from: accounts[7]});
    await pool.depositWithNFT(6, web3.utils.toWei("200"), 7, 8, 0, {from: accounts[7]});

    console.log("PAN");
    console.log(panToken.address);
    console.log("ERC721");
    console.log(erc721.address);
    console.log("IDO");
    console.log(ido.address);
    console.log("C2C");
    console.log(c2c.address);
    console.log("Pool");
    console.log(pool.address);
    console.log("USDT");
    console.log(usdtToken.address);
    
  } else if (network == "testnet") {
    WBNB = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    PancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    airdropAddress = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    beneficancy = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    pancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    await deployer.deploy(ERC721Card, "PAN NFT","PANNFT", "http://api.pantheon.best/tokens/");
    let erc721 = await ERC721Card.deployed();
  
    let account1 = "0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6";
    let account2 = "0x95C65C0752b64B8Df8B749Dd096b47c473eba561";

    await erc721.mintWithLevel(0, accounts[0]);
    await erc721.mintWithLevel(1, accounts[0]);
    await erc721.mintWithLevel(2, accounts[0]);
    await erc721.mintWithLevel(3, accounts[0]);
    await erc721.mintWithLevel(4, accounts[0]);

    await erc721.mintWithLevel(0, account1);
    await erc721.mintWithLevel(1, account1);
    await erc721.mintWithLevel(2, account1);
    await erc721.mintWithLevel(3, account1);
    await erc721.mintWithLevel(4, account1);

    await erc721.mintWithLevel(0, account2);
    await erc721.mintWithLevel(1, account2);
    await erc721.mintWithLevel(2, account2);
    await erc721.mintWithLevel(3, account2);
    await erc721.mintWithLevel(4, account2);

    console.log((await erc721.balanceOf(accounts[0])).toNumber());
    console.log((await erc721.balanceOf(account1)).toNumber());
    console.log((await erc721.balanceOf(account2)).toNumber());
    console.log("110");
    await deployer.deploy(ERC20PresetFixedSupply, "USDT Token","USDT", 1000000, accounts[0]);
    let usdtToken = await ERC20PresetFixedSupply.deployed();
    await usdtToken.transfer(account1, web3.utils.toWei("10000"));
    await usdtToken.transfer(account2, web3.utils.toWei("10000"));
    console.log("111");

    console.log(erc721.address);
    console.log(airdropAddress);
    console.log(blackHoleAddress);

    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
    await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);
    let panToken = await ERC20PanToken.deployed();

    await panToken.transfer(accounts[1], web3.utils.toWei("10000"));
    await panToken.transfer(account1, web3.utils.toWei("10000"));
    await panToken.transfer(account2, web3.utils.toWei("10000"));


    // Deploy IDO
    console.log("Deploy IDO");
    let idoStart = toTimestamp("2021-08-19 15:00:00");
    let idoEnd = toTimestamp("2021-08-29 23:00:00");
    let claimStart = toTimestamp("2021-08-23 15:00:00");
    let claimEnd = toTimestamp("2021-11-23 15:00:00");
    await deployer.deploy(PantheonIDO, panToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    let ido = await PantheonIDO.deployed();
    await panToken.transfer(ido.address, web3.utils.toWei("400000"));

    console.log("114");
    // console.log((await panToken.balanceOf(accounts[1])).toNumber());
    // let _panAddress = "0x9fddDFcC89a75C977420A77dae14Cb013f5326E6";
    let erc20 = await ERC20PresetFixedSupply.deployed();
    console.log("112");
    await erc20.transfer(accounts[1], web3.utils.toWei("10000") );
    console.log("113");
    console.log(web3.utils.fromWei(await erc20.balanceOf(accounts[1])));
    await deployer.deploy(PantheonC2C, ERC721Card.address, panToken.address);
    chaPerBlock = web3.utils.toWei("50000")/24/1200;
    await deployer.deploy(PantheonPool, panToken.address, ERC20PresetFixedSupply.address, ERC721Card.address, beneficancy, web3.utils.toWei("1.736111"), 0, web3.utils.toWei("10000000"));
    let pool = await PantheonPool.deployed();
    await panToken.transfer(pool.address, web3.utils.toWei("50000"));
    // console.log(token);
    // pool.addPool(rate, token, isLp, dayNum, withUpdate);
    await pool.addPool(1500, panToken.address, false, 3*24*1200, false);
    await pool.addPool(3750, panToken.address, false, 7*24*1200, false);
    await pool.addPool(9375, panToken.address, false, 15*24*1200, false);
    await pool.addPool(23437, panToken.address, false, 30*24*1200, false);
    await pool.addPool(58592, panToken.address, false, 60*24*1200, false);
    await pool.addPool(117185, panToken.address, false, 90*24*1200, false);

    await pool.addPool(1000, panToken.address, true, 3*24*1200, false);
    await pool.addPool(2500, panToken.address, true, 7*24*1200, false);
    await pool.addPool(6250, panToken.address, true, 15*24*1200, false);
    await pool.addPool(15625, panToken.address, true, 30*24*1200, false);
    await pool.addPool(39062, panToken.address, true, 60*24*1200, false);
    await pool.addPool(78125, panToken.address, true, 90*24*1200, false);

    // await panToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[1]});
    // await pool.deposit(0, web3.utils.toWei("100"), {from: accounts[1]});
    // console.log("0-1",web3.utils.fromWei(await pool.pendingReward(0, accounts[1])));
    // await panToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[1]});
    // await pool.deposit(1, web3.utils.toWei("100"), {from: accounts[1]});
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    
    console.log("115");
    // await panToken.approve(pool.address, web3.utils.toWei("100"), {from: accounts[7]});
    // console.log("0-1",web3.utils.fromWei(await pool.pendingReward(0, accounts[1])));
    // await pool.deposit(0, web3.utils.toWei("100"), {from: accounts[7]});
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await pool.updateReward();
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await pool.updateReward();
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await panToken.transfer(accounts[1], web3.utils.toWei("100") );
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // await sleep(5000);
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // usdtToken.transfer(accounts[1], web3.utils.toWei("120"));
    // console.log("0-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));
    // console.log("1-1",web3.utils.fromWei(await pool.pendingReward(1, accounts[1])));

    console.log("PAN");
    console.log(panToken.address);
    console.log("ERC721");
    console.log(erc721.address);
    console.log("IDO");
    console.log(ido.address);
    console.log("C2C");
    console.log(c2c.address);
    console.log("Pool");
    console.log(pool.address);
    console.log("USDT");
    console.log(usdtToken.address);

  } else if (network == "bsc") {
    WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    BUSDT = "0x55d398326f99059ff775485246999027b3197955";
    pancakeRouter = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    airdropAddress = "0x5Bbdf8eDC852f114eDAF8D92Ce31cC74F62Db2BC";
    liquidAddress = "0xBDe8748b12516f73B4e6682e01Ec95C469C639DF"
    beneficancy = "0x2d6D02A42CB933c5Fb339cC79837b1b0Ef4fab34";
    console.log("accounts", accounts);

    // await deployer.deploy(ERC721Card, "PAN NFT","PANNFT", "https://api.pantheon.best/tokens/");
    // let erc721 = await ERC721Card.deployed();

    let account1 = "0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6";
    let account2 = "0x95C65C0752b64B8Df8B749Dd096b47c473eba561";


    // await erc721.mintWithLevel(0, accounts[0]);
    // await erc721.mintWithLevel(1, accounts[0]);
    // await erc721.mintWithLevel(2, accounts[0]);
    // await erc721.mintWithLevel(3, accounts[0]);
    // await erc721.mintWithLevel(4, accounts[0]);

    // await erc721.mintWithLevel(0, account1);
    // await erc721.mintWithLevel(1, account1);
    // await erc721.mintWithLevel(2, account1);
    // await erc721.mintWithLevel(3, account1);
    // await erc721.mintWithLevel(4, account1);

    // await erc721.mintWithLevel(0, account2);
    // await erc721.mintWithLevel(1, account2);
    // await erc721.mintWithLevel(2, account2);
    // await erc721.mintWithLevel(3, account2);
    // await erc721.mintWithLevel(4, account2);

    // console.log((await erc721.balanceOf(accounts[0])).toNumber());
    // console.log((await erc721.balanceOf(account1)).toNumber());
    // console.log((await erc721.balanceOf(account2)).toNumber());
    // console.log("110");
    // await deployer.deploy(ERC20PresetFixedSupply, "USDT Token","USDT", 1000000, accounts[0]);
    // let usdtToken = await ERC20PresetFixedSupply.deployed();
    // await usdtToken.transfer(account1, web3.utils.toWei("10000"));
    // await usdtToken.transfer(account2, web3.utils.toWei("10000"));
    // console.log("111");

    // console.log(erc721.address);
    console.log(airdropAddress);
    console.log(blackHoleAddress);

    // await deployer.deploy(ERC20PanToken, pancakeRouter, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);
    // let panToken = await ERC20PanToken.deployed();
    let panToken = await ERC20PanToken.at("0x3aF28Da6a016143a9DCa040eC8632D88fAA1cfd2");
    // panToken.setSwapAndLiquifyEnabled(true);

    // Deploy IDO
    // console.log("Deploy IDO");
    // let idoStart = toTimestamp("2021-08-19 15:00:00");
    // let idoEnd = toTimestamp("2021-08-29 23:00:00");
    // let claimStart = toTimestamp("2021-08-23 15:00:00");
    // let claimEnd = toTimestamp("2021-11-23 15:00:00");
    // await deployer.deploy(PantheonIDO, panToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    // let ido = await PantheonIDO.deployed();

    console.log("114");
    // console.log((await panToken.balanceOf(accounts[1])).toNumber());
    // let _panAddress = "0x9fddDFcC89a75C977420A77dae14Cb013f5326E6";
    // let erc20 = await ERC20PresetFixedSupply.deployed();
    // console.log("112");
    // await erc20.transfer(accounts[1], web3.utils.toWei("10000") );
    // console.log("113");
    // console.log(web3.utils.fromWei(await erc20.balanceOf(accounts[1])));
    // await deployer.deploy(PantheonC2C, ERC721Card.address, panToken.address);
    let erc721Address = await panToken.nftToken();
    console.log(erc721Address);
    await deployer.deploy(PantheonC2C, beneficancy, erc721Address, BUSDT); // USDT for buy NFT
    chaPerBlock = web3.utils.toWei("50000")/24/1200;
    await deployer.deploy(PantheonPool, panToken.address, BUSDT, erc721Address, beneficancy, blackHoleAddress, airdropAddress, liquidAddress, web3.utils.toWei("1.736111"), 0, web3.utils.toWei("149600000"));
    let pool = await PantheonPool.deployed();
    // ????????????????????????
    // await panToken.transfer("0x6089046d565D0B28ab31aAe67dD5F0a1E44C46c9", web3.utils.toWei("20000000")); // 10%=2000,0000
    // await panToken.transfer("0xdA6fe2F3aCfcc396c60d98AA61BD709953795537", web3.utils.toWei("20000000")); // 10% = 2000,00000
    // await panToken.transfer("0xE59034a1999951c4D9500B244666842E00Bd9E01", web3.utils.toWei("10000000")); // 5% = 1000,0000
    // await panToken.transfer("0xd7F6344E257681a90e138201E2290A4F8F2a2C57", web3.utils.toWei("400000")); // 0.2% = 40,0000
    // await panToken.transfer(ido.address, web3.utils.toWei("400000"));
    // await panToken.transfer(pool.address, web3.utils.toWei("149600000")); // 74.8% = 40,0000
    await panToken.setExcludeFromFee(pool.address);

    // console.log(token);
    // pool.addPool(rate, token, isLp, dayNum, withUpdate);
    await pool.addPool(1500, panToken.address, false, 3*24*1200, false);
    await pool.addPool(3750, panToken.address, false, 7*24*1200, false);
    await pool.addPool(9375, panToken.address, false, 15*24*1200, false);
    await pool.addPool(23437, panToken.address, false, 30*24*1200, false);
    await pool.addPool(58592, panToken.address, false, 60*24*1200, false);
    await pool.addPool(117185, panToken.address, false, 90*24*1200, false);

    await pool.addPool(1000, panToken.address, true, 3*24*1200, false);
    await pool.addPool(2500, panToken.address, true, 7*24*1200, false);
    await pool.addPool(6250, panToken.address, true, 15*24*1200, false);
    await pool.addPool(15625, panToken.address, true, 30*24*1200, false);
    await pool.addPool(39062, panToken.address, true, 60*24*1200, false);
    await pool.addPool(78125, panToken.address, true, 90*24*1200, false);

    await deployer.deploy(PantheonInviteReward, panToken.address, pool.address);
    let inviteReward = await PantheonInviteReward.deployed();
    
    console.log("115");
    console.log("PAN");
    console.log(panToken.address);
    console.log("ERC721");
    console.log(erc721.address);
    console.log("IDO");
    console.log(ido.address);
    console.log("C2C");
    console.log(c2c.address);
    console.log("Pool");
    console.log(pool.address);
    console.log("USDT");
    console.log(BUSDT);
    

  } else if (network == "bsctest") {
    WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    PancakeRouter = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    airdropAddress = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    beneficancy = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    idoStart = toTimestamp("2021-08-19 14:25:00");
    idoEnd = toTimestamp("2021-08-19 14:30:00");
    claimStart = toTimestamp("2021-08-19 14:32:00");
    claimEnd = toTimestamp("2021-11-23 14:40:00");
  }
};

function toTimestamp(strDate){
  var datum = Date.parse(strDate);
  return datum/1000;
}
