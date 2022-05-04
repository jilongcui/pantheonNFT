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
        uint256 tokenValue;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint16 total;
        uint16 current;
        BBoxStatus status;
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
        BBoxStatus status,
        uint16 current,
        uint16 total
    );
    event BBoxStateEvent(BBoxStatus status);

    // 发布者
    address public chairperson;
    // 受益者
    address public beneficiary;
    // BBoxerLog[] public idoerLogs;

    // 代币的地址
    address payable public nftAddress;

    // 新的盲盒的状态
    BBox[] public bboxes;

    // 构建函数，代币地址，受益者地址
    // ido 开始时间、结束时间、可以领取时间、领取结束时间
    constructor(address beneficiary_) payable {
        chairperson = msg.sender;
        beneficiary = beneficiary_;
    }

    function setBBoxToken(
        uint8 pid,
        address tokenAddr,
        uint256 tokenValue
    ) public onlyOwner {
        // 如果tokenAddr 为address(0) 表示是本币支付
        // 否则表示是代币支付
        BBox storage box = bboxes[pid];
        box.tokenAddr = tokenAddr;
        box.tokenValue = tokenValue;
    }

    function setBBoxTime(
        uint8 pid,
        uint256 start,
        uint256 end
    ) public onlyOwner {
        require(end > start);
        BBox storage box = bboxes[pid];
        box.startTimestamp = start;
        box.endTimestamp = end;
    }

    function setBBoxTotal(uint8 pid, uint16 total) public onlyOwner {
        BBox storage box = bboxes[pid];
        box.total = total;
    }

    function setBBoxNftToken(uint8 pid, address _nftAddress) public onlyOwner {
        require(_nftAddress != address(0));
        BBox storage box = bboxes[pid];
        box.nftToken = IERC721Card(_nftAddress);
    }

    function setBBoxStatus(uint8 pid, BBoxStatus status) public onlyOwner {
        BBox storage box = bboxes[pid];
        box.status = status;
    }

    function setBBoxInfo(
        uint8 pid,
        address _nftAddress,
        address tokenAddr,
        uint256 tokenValue,
        uint16 total,
        uint256 startTime,
        uint256 endTime
    ) public onlyOwner {
        bboxes[pid] = BBox({
            nftToken: IERC721Card(_nftAddress),
            tokenAddr: tokenAddr,
            tokenValue: tokenValue,
            total: total,
            current: 0,
            startTimestamp: startTime,
            endTimestamp: endTime,
            status: BBoxStatus.BLINDBOX_INIT
        });
    }

    // 购买BBox
    // 两种支付方式，一种是通过BNB本币购买，一种是通过代币购买，判断的依据是代币地址是否为空
    // 购买的代币会被转移到收款地址上
    function buyBBox(uint8 pid) public payable returns (bool) {
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
            payable(beneficiary).transfer(box.tokenValue);
        } else {
            IERC20 token = IERC20(box.tokenAddr);
            token.transferFrom(msg.sender, beneficiary, box.tokenValue);
        }

        box.current = box.current + 1;
        if (box.current == box.total) {
            box.status = BBoxStatus.BLINDBOX_SOLDOUT;
        }
        box.nftToken.mintCard(pid, msg.sender);
        emit BBoxSoldEvent(msg.sender, pid, box.status, box.current, box.total);
        return true;
    }

    function release() public onlyOwner {
        payable(chairperson).transfer(address(this).balance);
        for (uint16 i = 0; i < bboxes.length; i++) {
            BBox storage box = bboxes[i];
            IERC20(box.tokenAddr).transfer(
                chairperson,
                IERC20(box.tokenAddr).balanceOf(address(this))
            );
        }
    }

    function isBBoxEnable(uint8 pid) public view returns (bool) {
        uint256 timestamp = block.timestamp;
        BBox storage box = bboxes[pid];
        if (timestamp >= box.startTimestamp && timestamp < box.endTimestamp)
            return true;
        else return false;
    }

    // function getBBoxRemain() public view returns (uint256, uint256) {
    //     return (remainSupply, TOTAL_ETH_SUPPLY);
    // }
}
