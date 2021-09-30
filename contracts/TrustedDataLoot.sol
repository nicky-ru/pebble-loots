// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Base64.sol";

contract TrustedDataLoot is ERC721, ReentrancyGuard, Ownable {
  using SafeMath for uint256;

  uint256 private incrementalTokenId = 0;

  mapping (uint256 => bytes32) internal _tokenToHash;
  mapping (bytes32 => bool) private _mintedHashes;

  modifier onlyExistedToken(uint256 tokenId) {
    require(_exists(tokenId), "ERC721: set hash query for nonexistent token");
    _;
  }

  modifier onlyTokenOwnerOrApproved(uint256 tokenId) {
    address owner = ownerOf(tokenId);
    require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
      "ERC721: approve caller is not owner nor approved for all"
    );
    _;
  }

  function toByte(uint8 _uint8) public pure returns (byte) {
    if(_uint8 < 10) {
      return byte(_uint8 + 48);
    } else {
      return byte(_uint8 + 87);
    }
  }

  function getDataHash(uint256 tokenId) public view returns (string memory) {
    bytes32 _bytes32 = _tokenToHash[tokenId];

    uint8 i = 0;
    bytes memory bytesArray = new bytes(64);
    for (i = 0; i < bytesArray.length; i++) {

      uint8 _f = uint8(_bytes32[i/2] & 0x0f);
      uint8 _l = uint8(_bytes32[i/2] >> 4);

      bytesArray[i] = toByte(_f);
      i = i + 1;
      bytesArray[i] = toByte(_l);
    }
    return string(bytesArray);
  }

  function tokenURI(uint256 tokenId) public virtual override view onlyExistedToken(tokenId) returns (string memory) {
    string[3] memory parts;

    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 10px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    parts[1] = string(abi.encodePacked('0x', getDataHash(tokenId)));

    parts[2] = '</text></svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2]));

    string memory name = string(abi.encodePacked('"name": "Trusted data Loot #', toString(tokenId), '"'));
    string memory description = string(abi.encodePacked('"description": "Trusted data loot is a real world data stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble Loot in any way you want."'));

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{', name, ',', description, ',"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  function claim() public nonReentrant {
    incrementalTokenId = incrementalTokenId.add(1);
    _safeMint(_msgSender(), incrementalTokenId);
  }

  function setTokenHash(uint256 tokenId, uint32 _type, bytes memory data, uint32 timestamp)
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    bytes32 hash = sha256(abi.encodePacked(_type, data, timestamp));
    require(!_mintedHashes[hash], "This datapoint has been minted already");

    _mintedHashes[hash] = true;
    _tokenToHash[tokenId] = hash;
  }

  function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

    if (value == 0) {
      return "0";
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
      value /= 10;
    }
    return string(buffer);
  }

  constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable() {}
}
