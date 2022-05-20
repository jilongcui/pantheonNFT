// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IInviter {
    event InviteUser(
        address indexed parent,
        address indexed child,
        uint256 timestamp
    );

    event UpGroupPower(
        address indexed parent,
        address indexed child,
        uint256 power
    );
    event DownGroupPower(
        address indexed parent,
        address indexed child,
        uint256 power
    );

    // function upGroupPower(address child, uint256 power) internal;

    // function downGroupPower(address child, uint256 power) internal;

    // function calculeInviteReward(address child, uint256 total) external;

    function setInvite(address parent) external;

    function resetInvite(address user) external;

    function getParent(address user) external view returns (address parent);

    function getGroupPower(address user) external view returns (uint256 power);

    function isInvited(address user) external view returns (bool);

    function isForceInvite() external view returns (bool);

    function setInviteForce(bool enable) external;

    function setMaxInviteLayer(uint8 layer) external;
}
