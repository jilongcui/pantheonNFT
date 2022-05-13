// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const ERC20PresetFixedSupply = artifacts.require("ERC20PresetFixedSupply");
const ERC20DogeFoodToken = artifacts.require("ERC20DogeFoodToken");
const ERC721Card = artifacts.require("ERC721Card");
const DogeFoodBlindBox = artifacts.require("DogeFoodBlindBox");
// const ERC20 = artifacts.require("ERC20");
const DogeFoodSoloPool = artifacts.require("DogeFoodSoloPool");

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout)
  })
}

function toTimestamp(strDate) {
  var datum = Date.parse(strDate);
  return datum / 1000;
}

module.exports = async function (deployer, network, accounts) {
  // Deploy A, then deploy B, passing in A's newly deployed address
  let blackHoleAddress = "0x000000000000000000000000000000000000dEaD";
  let airdropAddress = accounts[4];
  let beneficancy = accounts[5];

  let WBNB = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
  let WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
  let PancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";


  if (network == "develop") {
    // Deploy NFT
    await deployer.deploy(ERC721Card, "DogeFood NFT", "DOGENFT", "https://api.dogefood.app/tokens/");


    // airdropAddress = accounts[1];
    // Deploy USDT
    await deployer.deploy(ERC20DogeFoodToken, "DogeFood Token", "DOGEFOOD", 1000000, accounts[0]);

    // Deploy BlindBox
    await deployer.deploy(DogeFoodBlindBox, accounts[0]);

    // Deploy Pool
    await deployer.deploy(DogeFoodSoloPool, ERC20DogeFoodToken.address, ERC721Card.address);

    // pancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);


    // Deploy IDO
    // let idoStart = toTimestamp("2021-08-19 15:00:00");
    // let idoEnd = toTimestamp("2021-08-29 23:00:00");
    // let claimStart = toTimestamp("2021-08-23 15:00:00");
    // let claimEnd = toTimestamp("2021-11-23 15:00:00");
    // await deployer.deploy(PantheonIDO, panToken.address, beneficancy, idoStart, idoEnd, claimStart, claimEnd);
    // let ido = await PantheonIDO.deployed();
    // await panToken.transfer(ido.address, web3.utils.toWei("400000"));

    // console.log((await panToken.balanceOf(accounts[1])).toNumber());
    // let _panAddress = "0x9fddDFcC89a75C977420A77dae14Cb013f5326E6";
    // let erc20 = await ERC20PresetFixedSupply.deployed();
    // console.log("112");
    // await erc20.transfer(accounts[1], web3.utils.toWei("10000"));
    // console.log("113");
    // console.log(web3.utils.fromWei(await erc20.balanceOf(accounts[1])));
    // await deployer.deploy(PantheonC2C, ERC721Card.address, panToken.address);




  } else if (network == "test") {
    WBNB = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    PancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    airdropAddress = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    beneficancy = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    pancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    await deployer.deploy(ERC721Card, accounts[0], "DogeFood NFT", "DOGENFT", "https://api.dogefood.app/tokens/");
    await deployer.deploy(ERC20DogeFoodToken, "DogeFood Token", "DogeFood", "420000000000000000", accounts[0]);
    // Deploy BlindBox
    await deployer.deploy(DogeFoodBlindBox, accounts[0]);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);
    await deployer.deploy(DogeFoodSoloPool, ERC20DogeFoodToken.address, ERC721Card.address);

  } else if (network == "testnet") { // bsctest
    WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    PancakeRouter = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    airdropAddress = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    beneficancy = "0xb905BbD447325394d34957cB73c57Ec6aF075447";
    await deployer.deploy(ERC721Card, accounts[0], "DogeFood NFT", "DOGENFT", "https://api.dogefood.app/tokens/");
    await deployer.deploy(ERC20DogeFoodToken, "DogeFood Token", "DogeFood", "420000000000000000", accounts[0]);
    // Deploy BlindBox
    await deployer.deploy(DogeFoodBlindBox, beneficancy);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);
    await deployer.deploy(DogeFoodSoloPool, ERC20DogeFoodToken.address, ERC721Card.address);
  } else if (network == "bsc") {
    WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    WUSDT = "0xc350c613e1c1f8e90f662ccbaf24cd32fe0ebc0b";
    BUSDT = "0x55d398326f99059ff775485246999027b3197955";
    pancakeRouter = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    airdropAddress = "0x5Bbdf8eDC852f114eDAF8D92Ce31cC74F62Db2BC";
    liquidAddress = "0xBDe8748b12516f73B4e6682e01Ec95C469C639DF"
    beneficancy = "0x2d6D02A42CB933c5Fb339cC79837b1b0Ef4fab34";
    console.log("accounts", accounts);
    await deployer.deploy(ERC721Card, accounts[0], "DogeFood NFT", "DOGENFT", "https://api.dogefood.app/tokens/");
    await deployer.deploy(ERC20DogeFoodToken, "DogeFood Token", "DogeFood", "420000000000000000", accounts[0]);
    // Deploy BlindBox
    await deployer.deploy(DogeFoodBlindBox, beneficancy);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, 200000000, accounts[0]);
    // await deployer.deploy(ERC20PanToken, pancakeRouter, erc721.address, blackHoleAddress, airdropAddress, liquidAddress, 200000000, accounts[0]);
    await deployer.deploy(DogeFoodSoloPool, ERC20DogeFoodToken.address, ERC721Card.address);
  }
};
