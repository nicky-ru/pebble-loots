// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PebbleDataPoint is ERC721, ERC721URIStorage, Ownable {
  /// @notice Token Id to Proto
  mapping (uint256 => string) tokenToDataPoint;

  constructor() ERC721("PebbleDataPoint", "PDP") {}

  function safeMint(address to, uint256 tokenId, string calldata proto) public onlyOwner {
    _safeMint(to, tokenId);
    tokenToDataPoint[tokenId] = proto;
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
  public
  view
  override(ERC721, ERC721URIStorage)
  returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
}
