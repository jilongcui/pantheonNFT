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
        address nftToken;
        address tokenAddr;
        uint256 tokenValue;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint8 category;
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

    event BBoxOpenEvent(
        address to,
        uint8 boxId,
        uint8 category,
        uint32 serialNo,
        uint8 level,
        uint32 power,
        uint256 value,
        string url,
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
    address public blackholeAddr;
    // 新的盲盒的状态
    BBox[] public bboxes;

    // 构建函数，代币地址，受益者地址
    // ido 开始时间、结束时间、可以领取时间、领取结束时间
    constructor(address beneficiary_) payable {
        chairperson = msg.sender;
        beneficiary = beneficiary_;
        blackholeAddr = address(0x000000000000000000000000000000000000dEaD);
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

    function setBBoxCategory(uint8 pid, uint8 category) public onlyOwner {
        BBox storage box = bboxes[pid];
        box.category = category;
    }

    function setBBoxTotal(uint8 pid, uint16 total) public onlyOwner {
        BBox storage box = bboxes[pid];
        box.total = total;
    }

    function setBBoxNftToken(uint8 pid, address _nftAddress) public onlyOwner {
        require(_nftAddress != address(0));
        BBox storage box = bboxes[pid];
        box.nftToken = _nftAddress;
    }

    function setBBoxStatus(uint8 pid, BBoxStatus status) public onlyOwner {
        BBox storage box = bboxes[pid];
        box.status = status;
    }

    function setBeneficiary(address _beneficiary) public onlyOwner {
        require(_beneficiary != address(0));
        beneficiary = _beneficiary;
    }

    function setBBoxInfo(
        uint8 category,
        address _nftAddress,
        address tokenAddr,
        uint256 tokenValue,
        uint16 total,
        uint256 startTime,
        uint256 endTime
    ) public onlyOwner returns (uint8 pid) {
        bboxes.push(
            BBox({
                nftToken: _nftAddress,
                tokenAddr: tokenAddr,
                tokenValue: tokenValue,
                category: category,
                total: total,
                current: 0,
                startTimestamp: startTime,
                endTimestamp: endTime,
                status: BBoxStatus.BLINDBOX_INIT
            })
        );
        return uint8(bboxes.length - 1);
    }

    // Get a SerialNo
    function getSerialNo(uint8 category, uint16 current)
        private
        pure
        returns (uint32)
    {
        return
            uint32(
                uint256(keccak256(abi.encodePacked(category, current))) %
                    1000000000
            );
    }

    function safeTransferToThis(IERC20 token, uint256 _amount) internal {
        // uint256 chaBal = token.balanceOf(address(this));
        // if (_amount > chaBal) {
        //     _amount = chaBal;
        // }
        token.transferFrom(msg.sender, blackholeAddr, _amount.mul(10).div(100));
        token.transferFrom(msg.sender, beneficiary, _amount.mul(10).div(100));
        token.transferFrom(msg.sender, address(this), _amount.mul(80).div(100));
    }

    // 购买BBox
    // 两种支付方式，一种是通过BNB本币购买，一种是通过代币购买，判断的依据是代币地址是否为空
    // 购买的代币会被转移到收款地址上
    function openBBox(uint8 pid, uint32 serialNo)
        public
        payable
        returns (bool)
    {
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
            safeTransferToThis(token, box.tokenValue);
        }

        box.current = box.current + 1;
        if (box.current == box.total) {
            box.status = BBoxStatus.BLINDBOX_SOLDOUT;
        }
        if (serialNo == 0) serialNo = getSerialNo(box.category, box.current);
        (uint8 level, uint256 power) = IERC721Card(box.nftToken).mintCard(
            box.category,
            serialNo,
            msg.sender
        );
        string memory url = IERC721Card(box.nftToken).tokenURI(
            uint256(serialNo)
        );
        emit BBoxOpenEvent(
            msg.sender,
            pid,
            box.category,
            serialNo,
            level,
            uint32(power),
            box.tokenValue,
            url,
            box.status,
            box.current,
            box.total
        );
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

    function getBBoxInfo(uint8 id)
        external
        view
        returns (
            uint8 category,
            uint16 current,
            uint16 total,
            address tokenAddr,
            uint256 tokenValue,
            uint256 startTimestamp,
            uint256 endTimestamp
        )
    {
        BBox memory bbox = bboxes[id];
        return (
            bbox.category,
            bbox.current,
            bbox.total,
            bbox.tokenAddr,
            bbox.tokenValue,
            bbox.startTimestamp,
            bbox.endTimestamp
        );
    }

    function getBBox(uint8 id, uint32 serialNo)
        external
        view
        returns (
            uint16 category,
            uint16 level,
            uint16 power,
            address owner,
            string memory url
        )
    {
        BBox memory bbox = bboxes[id];
        (category, level, power, owner) = IERC721Card(bbox.nftToken).getCard(
            serialNo
        );
        url = IERC721Card(bbox.nftToken).tokenURI(uint256(serialNo));
    }
}
