// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC20PresetFixedSupply = artifacts.require("ERC20PresetFixedSupply");
const ERC20PanToken = artifacts.require("ERC20BeanToken");
const ERC721Card = artifacts.require("ERC721Card");
const PantheonIDO = artifacts.require("PantheonIDO");
// const ERC20 = artifacts.require("ERC20");
const BeanC2C = artifacts.require("BeanC2C");
const BeanPool = artifacts.require("BeanPool");
const BeanInviteReward = artifacts.require("BeanInviteReward");

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
  let zeroAddress = "0x0000000000000000000000000000000000000000";
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
    await deployer.deploy(BeanC2C, ERC721Card.address, panToken.address);

    let c2c = await BeanC2C.deployed();
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
    await deployer.deploy(BeanPool, panToken.address, ERC20PresetFixedSupply.address, ERC721Card.address, beneficancy, web3.utils.toWei("1.736111"), 0, web3.utils.toWei("10000000"));
    let pool = await BeanPool.deployed();
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
    await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
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
    await deployer.deploy(BeanC2C, ERC721Card.address, panToken.address);
    chaPerBlock = web3.utils.toWei("50000")/24/1200;
    await deployer.deploy(BeanPool, panToken.address, ERC20PresetFixedSupply.address, ERC721Card.address, beneficancy, web3.utils.toWei("1.736111"), 0, web3.utils.toWei("10000000"));
    let pool = await BeanPool.deployed();
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
    airdropAddress = "0x525d434742D1C0E98ca3E92f7Bb7B2E901EBCe7B"; // 用来收取激励手续费
    beneficancy = "0x525240d46E4aaa3D2267389fB0f3f6aAB504866F"; // xxxx 用来收取C2C的USDT，和Pool的交易手续费
    console.log("accounts", accounts);

    // // Now should create ERC721Card at Token's contract.
    // // await deployer.deploy(ERC721Card, "BEAN NFT","BEANNFT", "https://api.magicbean.cc/tokens/");
    // // let erc721 = await ERC721Card.deployed();

    // let account1 = "0x3578ca6f43fD3C468c6E16DBC1ebec2f100030F6";
    // let account2 = "0x95C65C0752b64B8Df8B749Dd096b47c473eba561";


    // // await erc721.mintWithLevel(0, accounts[0]);
    // // await erc721.mintWithLevel(1, accounts[0]);
    // // await erc721.mintWithLevel(2, accounts[0]);
    // // await erc721.mintWithLevel(3, accounts[0]);
    // // await erc721.mintWithLevel(4, accounts[0]);

    // // await erc721.mintWithLevel(0, account1);
    // // await erc721.mintWithLevel(1, account1);
    // // await erc721.mintWithLevel(2, account1);
    // // await erc721.mintWithLevel(3, account1);
    // // await erc721.mintWithLevel(4, account1);

    // // await erc721.mintWithLevel(0, account2);
    // // await erc721.mintWithLevel(1, account2);
    // // await erc721.mintWithLevel(2, account2);
    // // await erc721.mintWithLevel(3, account2);
    // // await erc721.mintWithLevel(4, account2);

    // // console.log((await erc721.balanceOf(accounts[0])).toNumber());
    // // console.log((await erc721.balanceOf(account1)).toNumber());
    // // console.log((await erc721.balanceOf(account2)).toNumber());
    // // console.log("110");
    // // await deployer.deploy(ERC20PresetFixedSupply, "USDT Token","USDT", 1000000, accounts[0]);
    // // let usdtToken = await ERC20PresetFixedSupply.deployed();
    // // await usdtToken.transfer(account1, web3.utils.toWei("10000"));
    // // await usdtToken.transfer(account2, web3.utils.toWei("10000"));
    // // console.log("111");

    // // console.log(erc721.address);
    // console.log(airdropAddress);
    // console.log(blackHoleAddress);

    // let initSupply = 9990000;
    // // let startTimestamp = toTimestamp("2021-09-18 21:00:00");
    // let startTimestamp = "1632493800";
    // await deployer.deploy(ERC20PanToken, pancakeRouter, blackHoleAddress, airdropAddress, initSupply, startTimestamp, accounts[0]);
    // let beanToken = await ERC20PanToken.deployed();
    let beanToken = await ERC20PanToken.at("0x49d8322F51aA6312C0968517FB11f93127B038fC");
    // beanToken.setSwapAndLiquifyEnabled(true); // xxxx
//     await beanToken.setExcludeFromFee("0x525d434742D1C0E98ca3E92f7Bb7B2E901EBCe7B");
//     await beanToken.setExcludeFromFee("0x525240d46E4aaa3D2267389fB0f3f6aAB504866F");

//     await beanToken.setExcludeFromFee("0xad84eAEC4c746E1faF5F97A05c698239bF1C6d2a");
// await beanToken.setExcludeFromFee("0x01d4d4e7472A62801054B2f29527CbeF172DbDa6");
// await beanToken.setExcludeFromFee("0x3D8f3352B99D6C766a23F362d8fd18b243Be1BeC");
// console.log("1");
// await beanToken.setExcludeFromFee("0xa35276BE0eD20961c01968b663bE3e072c4a449D");
// console.log("1");
// await beanToken.setExcludeFromFee("0x5941cFC0fDa19a0fA388A6BCD2Fc2B712C2c1d76");
// console.log("1");
// await beanToken.setExcludeFromFee("0xa6a83BDA29C154924025b53CC97e2e6463a8E42c");
// console.log("1");
// await beanToken.setExcludeFromFee("0x017D758462002fD89CD7f1d146F108F91d7650C3");
// console.log("1");
// await beanToken.setExcludeFromFee("0x1265A24107B128BF90bd5f5f4Da7426d3A013DfE");
// console.log("1");
// await beanToken.setExcludeFromFee("0x386011602d9fF90b720C4DA72917f3f7e84e3816");
// console.log("1");
// await beanToken.setExcludeFromFee("0xB0FE20F2a3d2BeEaCd4E2267CeBA5470D080Cece");
// console.log("1");
// await beanToken.setExcludeFromFee("0x44A336ec864a902Fa5008c5aFEc815Ee26911240");
// console.log("1");
// await beanToken.setExcludeFromFee("0xfa12D8773d6a80D6585F6439cF7b8EF547922E50");
// console.log("1");
// await beanToken.setExcludeFromFee("0x34f6619811a296d824712d954AD08af980d578f9");
// console.log("1");
// await beanToken.setExcludeFromFee("0xd00e71F2f3c973f4E7A019ce6B4843E8Ca6CB738");
// console.log("1");
// await beanToken.setExcludeFromFee("0x3250d0b87B4EDF1eBFa7ee9d37d2A43bA1dE200f");
// console.log("1");
// await beanToken.setExcludeFromFee("0x84EB7B313d96b4dbdd49B279FA1C970003950143");
// console.log("1");
// await beanToken.setExcludeFromFee("0x14845436712aBA88348B2eF68CfA47C53B1E074b");
// console.log("1");
// await beanToken.setExcludeFromFee("0xC62E4298c76590A5d2A703b568fb821F223B1A0F");
// console.log("1");
// await beanToken.setExcludeFromFee("0xC35F99CfDdBC6a085E63bCe3bb82a21Bd4B843E6");
// console.log("1");
// await beanToken.setExcludeFromFee("0x79AA2Eb5e716ef25157FA93450ADa9b269fB432F");
// console.log("1");
// await beanToken.setExcludeFromFee("0xdEef653132DeaD88f018b70A75260013c399dE8f");
// console.log("1");
// await beanToken.setExcludeFromFee("0x110975E1ff1c2B09865bC2c80F1B1C1c1B39DA05");
// console.log("1");
// await beanToken.setExcludeFromFee("0x39b94acEfE30CBf30991D0537E4C60A35C148B4C");
// console.log("1");
// await beanToken.setExcludeFromFee("0x36CF94d9a566AbfCBbb909803C19D884E967CcA3");
// console.log("1");
// await beanToken.setExcludeFromFee("0x6D58749B8cE40140651a4fC7979F640522AB7932");
// console.log("1");
// await beanToken.setExcludeFromFee("0x1434f42C60d3c029D2E95Ea1bc19227e707E21A2");
// console.log("1");
// await beanToken.setExcludeFromFee("0x40cE87d3A2ab3a1e9a5cEbc1A00b391532476f7c");
// console.log("1");
// await beanToken.setExcludeFromFee("0x2B74E78b5e1Ff16E65aFD2F665Aa76e3d4Eaa21a");
// console.log("1");
// await beanToken.setExcludeFromFee("0x9Ec3C4F1e9A7aF9D2D6fd2544a0e4CBD3c13208b");
// console.log("1");
// await beanToken.setExcludeFromFee("0x3df9A56FDe3f9768d68eFF33755E67818AbE55d4");
// console.log("1");
// await beanToken.setExcludeFromFee("0x74EF5b1BeCbCFCAd82f605321b7f66dfe9400f3D");
// console.log("1");
// await beanToken.setExcludeFromFee("0x788FA16AC7AA2E7642a97dB16db3558547920bf0");
// console.log("1");
// await beanToken.setExcludeFromFee("0x3DF6a2b39d39F64B42D4D0F19f1183D9ee7d9953");
// console.log("1");
// await beanToken.setExcludeFromFee("0x1194F5339a8f365326A8d3fc290e200AFa37AD37");
// console.log("1");
// await beanToken.setExcludeFromFee("0x8EF4378B2dC2f80b09De113e086ac5d0Cd0cF183");
// console.log("1");
// await beanToken.setExcludeFromFee("0x420BB67C5842D7B7268B9966289C4E753706954e");
// console.log("1");
// await beanToken.setExcludeFromFee("0x011c6FFCBBdfF224701E983479ED43c2d54877ab");
// console.log("1");
// await beanToken.setExcludeFromFee("0xB29686C9C79bD3F590d8F3E7a35d4d334713517b");
// console.log("1");
// await beanToken.setExcludeFromFee("0x98e4Bf98e3fc30e8427F529CE4003A61EF516010");
// console.log("1");
// await beanToken.setExcludeFromFee("0x6f807300B65EEE54715CAb4beCc2E95d24f010e3");
// console.log("1");
// await beanToken.setExcludeFromFee("0x16b88Ca5ac50d8cE0760fbcaEBDAa4345E32A072");
// console.log("1");
// await beanToken.setExcludeFromFee("0x1d91FDA47490bBE92b9cB82f4DE79789b85a4606");
// console.log("1");
// await beanToken.setExcludeFromFee("0x39C16c082da7943c8d2b45A4338A1145683244bc");
// console.log("1");
// await beanToken.setExcludeFromFee("0x35B32d361a7A36b6a1a9954A76e0cEac80241AD1");
// console.log("1");
// await beanToken.setExcludeFromFee("0x758cC3C3b735b891FBCaa64177E0A24CD5cB2Fe1");
// console.log("1");
// await beanToken.setExcludeFromFee("0x85Ea166E14773B79fF0A8b2BC8438eB6923741dA");
// console.log("1");
// await beanToken.setExcludeFromFee("0xE18F66eAA691D38fbF55e494e53d2DDd856F4570");
// console.log("1");
// await beanToken.setExcludeFromFee("0x0757023dFEE9463350c0E4a8849522FedC9B8EA8");
// console.log("1");
// await beanToken.setExcludeFromFee("0xFc1Ea9777a61eD2cE60E7c46129F787A25F25B26");
// console.log("1");
// await beanToken.setExcludeFromFee("0x838f1E162c7570331AEEd10e4B0437837a31Ed42");
// console.log("1");
    
// await beanToken.setExcludeFromFee("0x9f9AeCD774f841c8E447EfA25151d22166e9D66a");
// console.log("2");
// await beanToken.setExcludeFromFee("0x4129701B1109Ab9994C4019D7c45431C3f901438");
// console.log("2");
// await beanToken.setExcludeFromFee("0x364078AC40BF466Ac006B6e7B9fBE8CB4E4e644E");
// console.log("2");
// await beanToken.setExcludeFromFee("0x933FC6195f2dFC203bE40953465BE08206511f78");
// console.log("2");
// await beanToken.setExcludeFromFee("0x6058085732436079E405933b64C9F8A8E39E15FC");
// console.log("2");
// await beanToken.setExcludeFromFee("0x3150ca30D73Cd24a49E214C1a3234bEc67E4eD0a");
// console.log("2");
// await beanToken.setExcludeFromFee("0xd106630de9d0b8d032BE4DBa3330956D871c03e3");
// console.log("2");
// await beanToken.setExcludeFromFee("0x5cbC675Fe32805472F8173Bb5c06D8a961442806");
// console.log("2");
// await beanToken.setExcludeFromFee("0x5436e51d7c5C415F596653841eeD64c67ca1E274");
// console.log("2");
// await beanToken.setExcludeFromFee("0x615B6144fe3Be3A853B819B3863383Bca246e9a7");
// console.log("2");
// await beanToken.setExcludeFromFee("0x0E31F5347114bD01c5B4cFbca920d2046036C017");
// console.log("2");
// await beanToken.setExcludeFromFee("0x8dB7FF13B455bab04B8423656DE1466af8376A5f");
// console.log("2");
// await beanToken.setExcludeFromFee("0x487E1D5E14ad36E2b34a25eC045DeA11B1680cb4");
// console.log("2");
// await beanToken.setExcludeFromFee("0x33d6942c2bbC9D626762325124e3593538e49837");
// console.log("2");
// await beanToken.setExcludeFromFee("0x01B02e125Bdd8Af744016AE433CebbDeEc15E326");
// console.log("2");
// await beanToken.setExcludeFromFee("0x553b821D43483C8d448cb39Cb546c188feCEfFd6");
// console.log("2");
// await beanToken.setExcludeFromFee("0xe1b089E8910845eE09140a042cf3600e9EEe4703");
// console.log("2");
// await beanToken.setExcludeFromFee("0x00F729496A4c6Ad088c9fD58BCE46eA817C24613");
// console.log("2");
// await beanToken.setExcludeFromFee("0x6475f89dc3B3d9689EAcB6e335F7DAD219Cb786e");
// console.log("2");
// await beanToken.setExcludeFromFee("0x3Bdc567e16ab956E57b11B53f19880312e7CEdB9");
// console.log("2");
// await beanToken.setExcludeFromFee("0xAE44F18885e22e0915fa493C8d39Df43b2C07940");
// console.log("2");
// await beanToken.setExcludeFromFee("0x5dA1e4E27DAaC60E8e277f3f63ae063812E8feF7");
// console.log("2");
// await beanToken.setExcludeFromFee("0xfe15abEa2A2aC0F9A6F3A91eCE27bCe3BfcaA392");
// console.log("2");
// await beanToken.setExcludeFromFee("0xd5e7845b268F8E5276d71690e1c16E4F24448B32");
// console.log("2");
// await beanToken.setExcludeFromFee("0x38FEDa7650E57B7978f76D817f7Cb5a05123252d");
// console.log("2");
// await beanToken.setExcludeFromFee("0x195B3fa478452110894fb3B6EB28d48b09df041c");
// console.log("2");
// await beanToken.setExcludeFromFee("0xDFA938e553A6978aba74d90b458767789D67963b");
// console.log("2");
// await beanToken.setExcludeFromFee("0x6008a9A77A875FF2ca8E8A4D78260bc5Ad807412");
// console.log("2");
// await beanToken.setExcludeFromFee("0x1a98AD6F4e094cEBC791533f93b1162262922665");
// console.log("2");
// await beanToken.setExcludeFromFee("0xd59b3693f88ffB8e15250E53DfE6c6FB98DAaBDb");
// console.log("2");
// await beanToken.setExcludeFromFee("0xA55Af3aa9E7156d7EB3fa82c9E01539A2fb45362");
// console.log("2");
// await beanToken.setExcludeFromFee("0xEEF7Ae965638e5885CeD6Bb9f694d8A61DaB1f1d");
// console.log("2");
// await beanToken.setExcludeFromFee("0x24Ae131E508b6A85CcA58ab686B8B491b4E3D63E");
// console.log("2");
// await beanToken.setExcludeFromFee("0x56E33959DAa66eA10fB3112b82382CC896A9c566");
// console.log("2");
// await beanToken.setExcludeFromFee("0x197BCAbFfB3E6B028BaCED236649Efb22B8B9Dd9");
// console.log("2");
// await beanToken.setExcludeFromFee("0xF89D4De89D47C8F03DBA9eB3151E9cC4385956BC");
// console.log("2");
// await beanToken.setExcludeFromFee("0x29599Ff07cbfE9b1C8388F51ee04cD9f5125B639");
// console.log("2");
// await beanToken.setExcludeFromFee("0x2CE7f4307f3995fa4a570aD322a40Ed060EA4398");
// console.log("2");
// await beanToken.setExcludeFromFee("0xeD9420d46d91459c7Bd14C1F58802d430be91008");
// console.log("2");
// await beanToken.setExcludeFromFee("0x3E6829c9009EC6Ab8975AB13C3D0B0E268BbB6a9");
// console.log("2");
// await beanToken.setExcludeFromFee("0x8386bc5706d7332192c0661d822BF0Dd574eDA9B");
// console.log("2");
// await beanToken.setExcludeFromFee("0x7df0A9e0FB24bB80Ff7b9F922c13804311f7C64F");
// console.log("2");
// await beanToken.setExcludeFromFee("0x4519D1341ef5A60ae82b5A87fF58Bf305960B9E2");
// console.log("2");
// await beanToken.setExcludeFromFee("0x4522b9F465E733f9c09A29e67F3F99e76249BE60");
// console.log("2");
// await beanToken.setExcludeFromFee("0x2E47512eC936964E21fF8437BB66d60744E0f46c");
// console.log("2");
// await beanToken.setExcludeFromFee("0x2f3D57B2D4FbEd3596B2502d8a2788982fDf7BDf");
// console.log("2");
// await beanToken.setExcludeFromFee("0x99c7800F7744c2b2Fad140843fa08714969D6956");
// console.log("2");
// await beanToken.setExcludeFromFee("0x419c05D77Fe9F505567300EeEa6D49877b4f7D19");
// console.log("2");
// await beanToken.setExcludeFromFee("0x25FdEd1E0d0AE347C3574638a1396B593ce5AaF8");
// console.log("2");
// await beanToken.setExcludeFromFee("0x53A6e0b96D51F8Aa393e9b6e430d678b1113Fa92");

    // // Deploy IDO
    // // console.log("Deploy IDO");
    // // let idoStart = toTimestamp("2021-08-19 15:00:00");
    // // let idoEnd = toTimestamp("2021-08-29 23:00:00");
    // // let claimStart = toTimestamp("2021-08-23 15:00:00");
    // // let claimEnd = toTimestamp("2021-11-23 15:00:00");
    // // await deployer.deploy(PantheonIDO, beanToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    // // let ido = await PantheonIDO.deployed();

    // // console.log((await beanToken.balanceOf(accounts[1])).toNumber());
    // // let _panAddress = "0x9fddDFcC89a75C977420A77dae14Cb013f5326E6";
    // // let erc20 = await ERC20PresetFixedSupply.deployed();
    // // console.log("112");
    // // await erc20.transfer(accounts[1], web3.utils.toWei("10000") );
    // // console.log("113");
    // // console.log(web3.utils.fromWei(await erc20.balanceOf(accounts[1])));
    // // await deployer.deploy(BeanC2C, ERC721Card.address, beanToken.address);
    // let erc721Address = await beanToken.nftToken();
    // console.log(erc721Address);
    // await deployer.deploy(BeanC2C, beneficancy, erc721Address, BUSDT); // USDT for buy NFT
    // let c2c = await BeanC2C.deployed();
    let inviteAddress = "0x81a4e00Fa65944b2BDB9F48f3619Fa0561C59eb9";
    let panTokenAddress = "0x1f6fD0b74A173f112F8aAa2BeD78d45239c08B26";
    chaPerBlock = web3.utils.toWei("0.086805556"); // 2500/24/1200
    let beanTokenAddress = "0x03F7AEfA2dEFFdEe60b97DBAD11F21Ec701F4642";
    let erc721Address = "0xBa3e9D2b60B0Bb1c380F279E33019088AECb818f";
    let poolAddress = "0x7fcCC40d933E4Ec42289920C718908acb88236fb";
    // await deployer.deploy(BeanPool, beanTokenAddress, erc721Address, inviteAddress, blackHoleAddress, airdropAddress, chaPerBlock, 0, web3.utils.toWei("7000000"));
    // let pool = await BeanPool.deployed();
    // // 要转给那几个地址
    // await beanToken.transfer("0x2f6aA65C79c7210da9d9CFA9DaD5Bcd0433D3C0A", web3.utils.toWei("290000")); //
    // await beanToken.transfer("0x31cDB66F1A8A1A243121674cb3928eD27D23c795", web3.utils.toWei("200000")); //
    // await beanToken.transfer("0x23bE592f69f83EafeDD03aA9992F22A3E856AC49", web3.utils.toWei("300000")); //
    // await beanToken.transfer("0x03fB46515DC130736f14492c4d67002B02A6488d", web3.utils.toWei("200000")); //
    // // await beanToken.transfer(ido.address, web3.utils.toWei("400000"));
    // await beanToken.setExcludeFromFee(pool.address);
    // await beanToken.transfer(pool.address, web3.utils.toWei("4000000")); // xxxxx 7000000
    // // console.log(token);
    // // pool.addPool(rate, token, isLp, dayNum, withUpdate);
    // await pool.addPool(1200, 0, beanTokenAddress, zeroAddress, false, 3*24*1200, false);
    // await pool.addPool(4000, 0, beanTokenAddress, zeroAddress, false, 7*24*1200, false);
    // await pool.addPool(8000, 0, beanTokenAddress, zeroAddress, false, 15*24*1200, false);
    // await pool.addPool(16000, 0, beanTokenAddress, zeroAddress, false, 30*24*1200, false);

    // // amountRate = 1000 / 4
    // await pool.addPool(1000, 250, beanTokenAddress, BUSDT, true, 3*24*1200, false);
    // await pool.addPool(3000, 250, beanTokenAddress, BUSDT, true, 7*24*1200, false);
    // await pool.addPool(6000, 250, beanTokenAddress, BUSDT, true, 15*24*1200, false);
    // await pool.addPool(12000, 250, beanTokenAddress, BUSDT, true, 30*24*1200, false);

    // amountRate = 1000 / 1000
    // await pool.addPool(1500, 1000, beanTokenAddress, panTokenAddress, true, 3*24*1200, false);
    // await pool.addPool(6000, 1000, beanTokenAddress, panTokenAddress, true, 7*24*1200, false);
    // await pool.addPool(10000, 1000, beanTokenAddress, panTokenAddress, true, 15*24*1200, false);
    // await pool.addPool(20000, 1000, beanTokenAddress, panTokenAddress, true, 30*24*1200, false);

    // await deployer.deploy(BeanInviteReward, beanTokenAddress, poolAddress);
    // let inviteReward = await BeanInviteReward.deployed();
    // await beanToken.transfer(inviteReward.address, web3.utils.toWei("500000")); // xxxx 2000000

    // console.log("115");
    // console.log("PAN");
    // console.log(beanToken.address);
    // console.log("ERC721");
    // console.log(erc721Address);
    // // console.log("IDO");
    // // console.log(ido.address);
    // console.log("C2C");
    // console.log(c2c.address);
    // console.log("Pool");
    // console.log(pool.address);
    // console.log("Invite");
    // console.log(inviteReward.address);
    // console.log("USDT");
    // console.log(BUSDT);

  } else if (network == "bsctest") {
    WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    // BUSDT = "0x55d398326f99059ff775485246999027b3197955";
    pancakeRouter = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    airdropAddress = "0x525d434742D1C0E98ca3E92f7Bb7B2E901EBCe7B"; // 用来收取激励手续费
    beneficancy = "0x525240d46E4aaa3D2267389fB0f3f6aAB504866F"; // 用来收取C2C的USDT，和Pool的交易手续费
    console.log("accounts", accounts);

    // Now should create ERC721Card at Token's contract.
    // await deployer.deploy(ERC721Card, "BEAN NFT","BEANNFT", "https://api.magicbean.cc/tokens/");
    // let erc721 = await ERC721Card.deployed();

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
    await deployer.deploy(ERC20PresetFixedSupply, "USDT Test","UTEST", 1000000, accounts[0]);
    let usdtToken = await ERC20PresetFixedSupply.deployed();
    await usdtToken.transfer(account1, web3.utils.toWei("10000"));
    await usdtToken.transfer(account2, web3.utils.toWei("10000"));
    console.log("111");

    // console.log(erc721.address);
    console.log(airdropAddress);
    console.log(blackHoleAddress);

    let initSupply = 9990000;
    let startTimestamp = toTimestamp("2021-09-18 21:00:00");
    await deployer.deploy(ERC20PanToken, pancakeRouter, blackHoleAddress, airdropAddress, initSupply, startTimestamp, accounts[0]);
    let beanToken = await ERC20PanToken.deployed();
    // let beanToken = await ERC20PanToken.at("0x3aF28Da6a016143a9DCa040eC8632D88fAA1cfd2");
    await beanToken.setSwapAndLiquifyEnabled(true); // xxxx

    // Deploy IDO
    // console.log("Deploy IDO");
    // let idoStart = toTimestamp("2021-08-19 15:00:00");
    // let idoEnd = toTimestamp("2021-08-29 23:00:00");
    // let claimStart = toTimestamp("2021-08-23 15:00:00");
    // let claimEnd = toTimestamp("2021-11-23 15:00:00");
    // await deployer.deploy(PantheonIDO, beanToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    // let ido = await PantheonIDO.deployed();

    // console.log((await beanToken.balanceOf(accounts[1])).toNumber());
    // let _panAddress = "0x9fddDFcC89a75C977420A77dae14Cb013f5326E6";
    // let erc20 = await ERC20PresetFixedSupply.deployed();
    // console.log("112");
    // await erc20.transfer(accounts[1], web3.utils.toWei("10000") );
    // console.log("113");
    // console.log(web3.utils.fromWei(await erc20.balanceOf(accounts[1])));
    // await deployer.deploy(BeanC2C, ERC721Card.address, beanToken.address);
    let erc721Address = await beanToken.nftToken();
    console.log(erc721Address);
    await deployer.deploy(BeanC2C, beneficancy, erc721Address, BUSDT); // USDT for buy NFT
    let c2c = await BeanC2C.deployed();
    let inviteAddress = "0x81a4e00Fa65944b2BDB9F48f3619Fa0561C59eb9";
    let panTokenAddress = "0x1f6fD0b74A173f112F8aAa2BeD78d45239c08B26";
    chaPerBlock = web3.utils.toWei("0.086805556"); // 2500/24/1200
    await deployer.deploy(BeanPool, beanToken.address, erc721Address, inviteAddress, blackHoleAddress, airdropAddress, chaPerBlock, 0, web3.utils.toWei("7000000"));
    let pool = await BeanPool.deployed();
    // 要转给那几个地址
    await beanToken.transfer("0x2f6aA65C79c7210da9d9CFA9DaD5Bcd0433D3C0A", web3.utils.toWei("290000")); //
    await beanToken.transfer("0x31cDB66F1A8A1A243121674cb3928eD27D23c795", web3.utils.toWei("200000")); //
    await beanToken.transfer("0x23bE592f69f83EafeDD03aA9992F22A3E856AC49", web3.utils.toWei("300000")); //
    await beanToken.transfer("0x03fB46515DC130736f14492c4d67002B02A6488d", web3.utils.toWei("200000")); //
    // await beanToken.transfer(ido.address, web3.utils.toWei("400000"));
    await beanToken.setExcludeFromFee(pool.address);
    await beanToken.transfer(pool.address, web3.utils.toWei("4000000")); // xxxxx 7000000

    // console.log(token);
    // pool.addPool(rate, token, isLp, dayNum, withUpdate);
    await pool.addPool(1200, 0, beanToken.address, zeroAddress, false, 3*24*1200, false);
    await pool.addPool(4000, 0, beanToken.address, zeroAddress, false, 7*24*1200, false);
    await pool.addPool(8000, 0, beanToken.address, zeroAddress, false, 15*24*1200, false);
    await pool.addPool(16000, 0, beanToken.address, zeroAddress, false, 30*24*1200, false);

    // amountRate 1000 / 250 = 4 / 1
    await pool.addPool(1000, 250, beanToken.address, BUSDT, true, 3*24*1200, false);
    await pool.addPool(3000, 250, beanToken.address, BUSDT, true, 7*24*1200, false);
    await pool.addPool(6000, 250, beanToken.address, BUSDT, true, 15*24*1200, false);
    await pool.addPool(12000, 250, beanToken.address, BUSDT, true, 30*24*1200, false);

    // amountRate 1000 / 1000 = 1 / 1
    await pool.addPool(1500, 1000, beanToken.address, panTokenAddress, true, 3*24*1200, false);
    await pool.addPool(6000, 1000, beanToken.address, panTokenAddress, true, 7*24*1200, false);
    await pool.addPool(10000, 1000, beanToken.address, panTokenAddress, true, 15*24*1200, false);
    await pool.addPool(16000, 1000, beanToken.address, panTokenAddress, true, 30*24*1200, false);

    await deployer.deploy(BeanInviteReward, beanToken.address, pool.address);
    let inviteReward = await BeanInviteReward.deployed();
    await beanToken.transfer(inviteReward.address, web3.utils.toWei("2000000")); // xxxx 2000000

    console.log("115");
    console.log("PAN");
    console.log(beanToken.address);
    console.log("ERC721");
    console.log(erc721Address);
    // console.log("IDO");
    // console.log(ido.address);
    console.log("C2C");
    console.log(c2c.address);
    console.log("Pool");
    console.log(pool.address);
    console.log("Invite");
    console.log(inviteReward.address);
    console.log("USDT");
    console.log(BUSDT);
  }
};

function toTimestamp(strDate){
  var datum = Date.parse(strDate);
  return datum/1000;
}
