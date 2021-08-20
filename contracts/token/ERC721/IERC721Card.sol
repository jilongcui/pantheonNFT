// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721Card is IERC721 {

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function levelOf(uint256 id) external view returns (uint8 level);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function mintWithLevel(uint8 level, address to) external view returns (address owner);
}
