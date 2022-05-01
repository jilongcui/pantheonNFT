// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721Card is IERC721 {
    struct CardInfo {
        uint16 total;
        uint16 current;
        uint16 power;
    }

    event MintWithLevel(
        address indexed from,
        address indexed to,
        uint16 category,
        uint16 level,
        uint256 id,
        uint256 timestamp
    );

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function levelOf(uint8 _category, uint256 id)
        external
        view
        returns (uint8 level);

     /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function powerOf(uint8 _category, uint256 id)
        external
        view
        returns (uint8 power);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function cardView(uint8 _category, uint8 level)
        external
        view
        returns (CardInfo memory);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function mintWithLevel(
        uint8 _category,
        uint8 _level,
        address to
    ) external returns (bool);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function mintCard(uint8 _category, address to) public returns (bool)
}
