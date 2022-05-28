// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./extensions/IERC721Metadata.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721Card is IERC721, IERC721Metadata {
    struct CardInfo {
        uint16 total;
        uint16 current;
        uint16 power;
    }

    event MintWithLevel(
        address indexed from,
        address indexed to,
        uint16 category,
        uint32 serialNo,
        uint16 level,
        uint256 timestamp
    );

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function levelOf(uint256 id) external view returns (uint8 level);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function powerOf(uint256 id) external view returns (uint16 power);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function cardView(uint8 _category, uint8 level)
        external
        view
        returns (CardInfo memory);

    function getCard(uint256 id)
        external
        view
        returns (
            uint16 category,
            uint16 level,
            uint16 power,
            address owner
        );

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function mintWithLevel(
        uint8 category,
        uint32 serialNo,
        uint8 level,
        address to
    ) external returns (bool);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function mintCard(
        uint8 category,
        uint32 serailNo,
        address to
    ) external returns (uint8 level, uint256 power);
}
