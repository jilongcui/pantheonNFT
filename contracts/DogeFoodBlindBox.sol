// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/math/SafeMath.sol";
import "./utils/Address.sol";
import "./access/Ownable.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC721/IERC721Card.sol";

contract DogeFoodBlindBox is Ownable {
    using SafeMath for uint256;

    enum BBoxStatus {
        BLINDBOX_INIT,
        BLINDBOX_START,
        BLINDBOX_SOLDOUT
    }
    //
    struct BBox {
        IERC721Card nftToken;
        address tokenAddr;
        address tokenValue;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint16 total;
        uint16 current;
        BoxStatus status;
    }

    struct BBoxer {
        uint256 ethValue;
        uint256 panValue;
        // uint timestamp;
        bool claimed;
    }

    // struct BBoxerLog {
    //   address addr;
    //   uint ethValue;
    //   uint panValue;
    //   uint timestamp;
    // }

    event BBoxSoldEvent(
        address to,
        uint8 category,
        uint8 status,
        uint16 current,
        uint16 total
    );
    event BBoxStateEvent(BoxStatus status);

    // 发布者
    address public chairperson;
    // 受益者
    address public beneficancy;
    // BBoxerLog[] public idoerLogs;

    // 代币的地址
    address payable public nftAddress;

    // 新的盲盒的状态
    mapping(address => BBox) public bboxes;

    // 构建函数，代币地址，受益者地址
    // ido 开始时间、结束时间、可以领取时间、领取结束时间
    constructor(address beneficancy_) payable {
        chairperson = msg.sender;
        beneficancy = beneficancy_;
    }

    function setBBoxValue(
        uint8 pid,
        address tokenAddr,
        uint256 tokenValue
    ) public onlyOwner {
        require(_erc20Address != address(0));
        BBox storage box = bboxes[pid];
        box.tokenAddr = tokenAddr;
        box.tokenValue = tokenValue;
    }

    function setBBoxTime(
        uint16 pid,
        uint256 start,
        uint256 end
    ) public onlyOwner {
        require(end > start);
        BBox storage box = bboxes[pid];
        box.startTimestamp = start;
        box.endTimestamp = end;
    }

    function setBBoxTotal(uint16 pid, uint16 total) public onlyOwner {
        require(end > start);
        BBox storage box = bboxes[pid];
        box.total = total;
    }

    function setBBoxNftToken(uint16 pid, address nftAddress) public onlyOwner {
        require(end > start);
        BBox storage box = bboxes[pid];
        box.nftToken = IERC721Card(nftAddress);
    }

    function setBBoxInfo(
        uint8 pid,
        address nftAddress,
        address tokenAddr,
        uint256 tokenValue,
        uint16 total,
        uint256 startTime,
        uint256 endTime
    ) public onlyOwner {
        bboxes[pid] = BBox({
            nftToken: IERC721Card(nftAddress),
            tokenAddr: tokenAddr,
            tokenValue: tokenAddr,
            total: total,
            current: 0,
            startTimestamp: startTime,
            endTimestamp: endTime,
            status: BBoxStatus.BLINDBOX_INIT
        });
    }

    // 发送Eth进行BLINDBOX
    // 本质是通过这个函数发送ETH，然后得到的对应代币的数量，这些记录在链上。
    function buyBBox(uint16 pid) public payable returns (bool) {
        uint256 timestamp = block.timestamp;
        BBox storage box = bboxes[pid];
        require(box.current < box.total, "No remain bbox supply");
        // require(
        //     msg.value >= box.tokenValue,
        //     "BLINDBOX value should big than box value"
        // );
        // require(
        //     idoers[msg.sender].ethValue + msg.value <= MAX_DEPOSITE_ETH,
        //     "BLINDBOX total value should less than 4ETH"
        // );
        require(
            timestamp >= box.startTimestamp && timestamp < box.endTimestamp,
            "BLINDBOX is not open"
        );
        if (box.tokenAddr == address(0)) {
            payable(beneficancy).transfer(box.tokenValue);
        } else {
            IERC20 memory token1 = IERC20(box.tokenAddr);
            token1.transferFrom(msg.sender, beneficancy, box.tokenValue);
        }

        box.current = box.current.add(1);
        if (box.current == box.total) {
            box.status = box.BLINDBOX_SOLDOUT;
        }
        box.nftToken.mintCard(pid, msg.sender);
        emit BBoxSoldEvent(msg.sender, pid, box.status, box.current, box.total);
        return true;
    }

    function release() public onlyOwner {
        payable(chairperson).transfer(address(this).balance);
        token.transfer(chairperson, token.balanceOf(address(this)));
    }

    function isBBoxEnable() public view returns (bool) {
        uint256 timestamp = block.timestamp;
        if (timestamp >= idoStartTimestamp && timestamp < idoEndTimestamp)
            return true;
        else return false;
    }

    function isClaimEnable() public view returns (bool) {
        uint256 timestamp = block.timestamp;
        if (timestamp >= claimStartTimestamp && timestamp < claimEndTimestamp)
            return true;
        else return false;
    }

    function getBBoxRemainSupply() public view returns (uint256, uint256) {
        return (remainSupply, TOTAL_ETH_SUPPLY);
    }

    function getBBoxReleaseDate() public view returns (bool, uint256) {
        return (block.timestamp >= claimStartTimestamp, claimStartTimestamp);
    }
}
