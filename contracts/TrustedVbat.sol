// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "./TrustedDataLoot.sol";

contract TrustedVbat is TrustedDataLoot {
    struct TrustedRecord {
      bytes32 hash;
      uint256 vbat;
    }

  mapping (uint256 => TrustedRecord) private _tokenToRecord;

  function setTokenVBAT(
    uint256 tokenId,
    uint256 vbat
  )
  private {
    _tokenToRecord[tokenId].vbat = vbat;
  }

  function getVbat(uint256 tokenId) public view returns (uint256 vbat) {
    vbat = _tokenToRecord[tokenId].vbat;
  }

  function tokenURI(uint256 tokenId) public override view onlyExistedToken(tokenId) returns (string memory) {
    string[5] memory parts;

    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 10px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    parts[1] = string(abi.encodePacked('0x', getDataHash(tokenId)));

    parts[2] = '</text><text x="10" y="40" class="base">';

    parts[3] = string(abi.encodePacked('vbat: ', toString(getVbat(tokenId))));

    parts[4] = '</text></svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4]));

    string memory name = string(abi.encodePacked('"name": "Trusted VBAT Loot #', toString(tokenId), '"'));
    string memory description = string(abi.encodePacked('"description": "Trusted vbat loot is a real world data stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble Loot in any way you want."'));

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{', name, ',', description, ',"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  constructor(string memory name, string memory symbol) TrustedDataLoot(name, symbol) {}
}
