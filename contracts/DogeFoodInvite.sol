// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/math/SafeMath.sol";
import "./utils/Address.sol";
import "./access/Ownable.sol";
import "./IInviter.sol";

contract DogeFoodInvite is IInviter, Ownable {
    uint256 TOTAL_PAN_SUPPLY = 40 * 10**10; // 40*10^10 400000
    uint256 MIN_PAN_CLAIM = 1 * 10**6; // 1 PAN
    uint256 MIN_CLAIM_TIMEOFF = 24 * 3600; // 1Day

    using SafeMath for uint256;
    using Address for address;

    // Invite
    bool public inviteForce = false;
    uint8 public maxInviteLayer = 2;

    mapping(address => uint256) public groupPower;
    mapping(address => address) public userParent;
    mapping(address => uint8) public userLevel;
    mapping(address => uint256) public inviteReward;
    uint8[] inviteRatio = [2, 1, 0, 0, 0];

    // 构建函数，代币地址，受益者地址
    // ido 开始时间、结束时间、可以领取时间、领取结束时间
    constructor() payable {}

    function setInvite(address parent) public override {
        require(
            userParent[msg.sender] == address(0),
            "You already be invited."
        );
        // require(
        //     userParent[parent] != address(0),
        //     "Parent should be invite first."
        // );
        require(parent != msg.sender, "You cannot invite yourself.");
        userParent[msg.sender] = parent;
        emit InviteUser(parent, msg.sender, block.timestamp);
    }

    function resetInvite(address user) public override onlyOwner {
        userParent[user] = address(0);
        emit InviteUser(address(0), msg.sender, block.timestamp);
    }

    function setInviteForce(bool enable) public override onlyOwner {
        inviteForce = enable;
    }

    function setMaxInviteLayer(uint8 layer) public override onlyOwner {
        maxInviteLayer = layer;
    }

    function upGroupPower(address child, uint256 power) internal virtual {
        if (isInvited(child)) {
            uint8 ratio = inviteRatio[0];
            uint256 gpower = power.mul(ratio).div(100);
            groupPower[child] = groupPower[child].add(gpower);
            emit UpGroupPower(child, child, gpower);
        }
        for (uint8 layer = 0; layer < maxInviteLayer; layer++) {
            address parent = userParent[child];
            if (parent == address(0) || parent == child) return;
            uint8 ratio = inviteRatio[layer];
            uint256 gpower = power.mul(ratio).div(100);
            groupPower[parent] = groupPower[parent].add(gpower);
            child = parent;
            emit UpGroupPower(parent, child, gpower);
        }
    }

    function downGroupPower(address child, uint256 power) internal virtual {
        if (isInvited(child)) {
            uint8 ratio = inviteRatio[0];
            uint256 gpower = power.mul(ratio).div(100);
            groupPower[child] = groupPower[child].sub(gpower);
            emit DownGroupPower(child, child, gpower);
        }
        for (uint8 layer = 0; layer < maxInviteLayer; layer++) {
            address parent = userParent[child];
            if (parent == address(0) || parent == child) return;
            uint8 ratio = inviteRatio[layer];
            uint256 gpower = power.mul(ratio).div(100);
            groupPower[parent] = groupPower[parent].sub(gpower);
            child = parent;
            emit DownGroupPower(parent, child, gpower);
        }
    }

    // function calculeInviteReward(address child, uint256 total) public {
    //     for (uint8 layer = 0; layer < maxInviteLayer; layer++) {
    //         address parent = userParent[child];
    //         if (parent == address(0) || parent == child) return;
    //         uint8 ratio = inviteRatio[layer];
    //         if (ratio <= 0) {
    //             return;
    //         }
    //         uint256 reward = total.mul(ratio).div(100);
    //         inviteReward[parent] = inviteReward[parent].add(reward);
    //         child = parent;
    //     }
    // }

    function getInviteInfo(address addr)
        public
        view
        returns (uint256, address)
    {
        return (inviteReward[addr], userParent[addr]);
    }

    function getParent(address user)
        public
        view
        override
        returns (address parent)
    {
        return userParent[user];
    }

    function getGroupPower(address user)
        public
        view
        override
        returns (uint256 power)
    {
        return groupPower[user];
    }

    function isInvited(address user) public view override returns (bool) {
        return userParent[user] != address(0);
    }

    function isForceInvite() public view override returns (bool) {
        return inviteForce;
    }

    // claim
    // function claimFromInvite() public returns (bool) {
    //     require(claimEnabled, "The claim is disable.");
    //     Reward memory reward = rewardInfo[msg.sender];

    //     // Get current reward info from Pool address
    //     uint256 timestamp = block.timestamp;
    //     // require(timestamp.sub(reward.lastClaimTime) >= MIN_CLAIM_TIMEOFF, "You claim too frequency.");

    //     // Transfer
    //     DogeFoodPool poolContract = DogeFoodPool(poolAddress);
    //     uint256 totalReward = poolContract.inviteReward(msg.sender);
    //     uint256 amount = totalReward.sub(reward.lastAmount);
    //     require(amount >= 100e18, "The reward is little than 100 pan.");
    //     require(
    //         token.balanceOf(address(this)) >= amount,
    //         "Reward pool has invalid balance."
    //     );

    //     token.transfer(msg.sender, amount);

    //     reward.lastAmount = totalReward;
    //     reward.lastClaimTime = timestamp;
    //     rewardInfo[msg.sender] = reward;
    //     emit RewardClaimedEvent(amount, totalReward, timestamp);
    //     return true;
    // }

    // function getClaimInfo(address user) public view returns (uint256, uint256) {
    //     Reward memory reward = rewardInfo[user];
    //     DogeFoodPool poolContract = DogeFoodPool(poolAddress);
    //     uint256 totalReward = poolContract.inviteReward(user);
    //     uint256 amount = totalReward.sub(reward.lastAmount);
    //     return (amount, totalReward);
    // }

    // function isClaimEnabled() public view returns (bool) {
    //     return claimEnabled;
    // }
}
