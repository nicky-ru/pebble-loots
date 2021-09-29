// SPDX-License-Identifier: MIT
pragma solidity ^0.5.13;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";

contract TrustedDataLoot is ERC721Enumerable, ReentrancyGuard, Ownable, ERC721Metadata {

  struct TrustedRecord {
    bytes32 hash;
    uint256 snr;
    uint256 vbat;
    uint256 latitude;
    uint256 longitude;
    uint256 gasResistance;
    uint256 temperature;
    uint256 pressure;
    uint256 humidity;
    uint256 light;
    uint256 temperature2;
    int256[3] gyroscope;
    uint256[3] accelerometer;
    string random;
  }

  uint256 private incrementalTokenId = 0;

  mapping (uint256 => TrustedRecord) internal _tokenToTrustedRecord;
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
    bytes32 _bytes32 = _tokenToTrustedRecord[tokenId].hash;

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

  function tokenURI(uint256 tokenId) public view onlyExistedToken(tokenId) returns (string memory) {
    string[3] memory parts;

    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 10px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    parts[1] = string(abi.encodePacked('0x', getDataHash(tokenId)));

    parts[2] = '</text></svg>';

//    parts[2] = '</text><text x="10" y="40" class="base">';
//
//    parts[3] = string(abi.encodePacked('snr: ', toString(getSnr(tokenId)), ' light: ', toString(getLight(tokenId)) ));
//
//    parts[4] = '</text><text x="10" y="60" class="base">';
//
//    parts[5] = string(abi.encodePacked('latitude: ', toString(latitude), ' longitude: ', toString(longitude)));
//
//    parts[6] = '</text><text x="10" y="80" class="base">';
//
//    parts[7] = string(abi.encodePacked('pressure: ', toString(pressure), ' humidity: ', toString(humidity), ' gas resistance: ', toString(gasResistance) ));
//
//    parts[8] = '</text><text x="10" y="100" class="base">';
//
//    parts[9] = string(abi.encodePacked(' temperature: ', toString(temperature), ' temperature2: ', toString(temperature2)));
//
//    parts[10] = '</text><text x="10" y="120" class="base">';
//
//    parts[11] = string(abi.encodePacked('random: ', getRandom(tokenId)));

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
    _tokenToTrustedRecord[tokenId].hash = hash;
  }

  function getMotion(uint256 tokenId) public view returns (int256[3] memory gyroscope, uint256[3] memory accelerometer) {
    gyroscope = _tokenToTrustedRecord[tokenId].gyroscope;
    accelerometer = _tokenToTrustedRecord[tokenId].accelerometer;
  }

  function getClimate(uint256 tokenId) public view returns (uint256 pressure, uint256 humidity, uint256 temperature2, uint256 temperature, uint256 gasResistance) {
    gasResistance = _tokenToTrustedRecord[tokenId].gasResistance;
    temperature = _tokenToTrustedRecord[tokenId].temperature;
    pressure = _tokenToTrustedRecord[tokenId].pressure;
    humidity = _tokenToTrustedRecord[tokenId].humidity;
    temperature2 = _tokenToTrustedRecord[tokenId].temperature2;
  }

  function getLocation(uint256 tokenId) public view returns (uint256 latitude, uint256 longitude) {
    latitude = _tokenToTrustedRecord[tokenId].latitude;
    longitude = _tokenToTrustedRecord[tokenId].longitude;
  }

  function getLight(uint256 tokenId) public view returns (uint256 light) {
    light = _tokenToTrustedRecord[tokenId].light;
  }

  function getSnr(uint256 tokenId) public view returns (uint256 snr) {
    snr = _tokenToTrustedRecord[tokenId].snr;
  }

  function getRandom(uint256 tokenId) public view returns (string memory random) {
    random = _tokenToTrustedRecord[tokenId].random;
  }

  function setTokenMotion(
    uint256 tokenId,
    int256[3] memory gyroscope,
    uint256[3] memory accelerometer
  )
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    _tokenToTrustedRecord[tokenId].gyroscope = gyroscope;
    _tokenToTrustedRecord[tokenId].accelerometer = accelerometer;
  }

  function setTokenClimate(
    uint256 tokenId,
    uint256 pressure,
    uint256 humidity,
    uint256 temperature2,
    uint256 temperature,
    uint256 gasResistance
  )
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    _tokenToTrustedRecord[tokenId].gasResistance = gasResistance;
    _tokenToTrustedRecord[tokenId].temperature = temperature;
    _tokenToTrustedRecord[tokenId].pressure = pressure;
    _tokenToTrustedRecord[tokenId].humidity = humidity;
    _tokenToTrustedRecord[tokenId].temperature2 = temperature2;
  }

  function setTokenLocation(uint256 tokenId, uint256 latitude, uint256 longitude)
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    _tokenToTrustedRecord[tokenId].latitude = latitude;
    _tokenToTrustedRecord[tokenId].longitude = longitude;
  }

  function setTokenLight(
    uint256 tokenId,
    uint256 light
  )
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    _tokenToTrustedRecord[tokenId].light = light;
  }

  function setTokenRandom(
    uint256 tokenId,
    string memory random
  )
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    _tokenToTrustedRecord[tokenId].random = random;
  }

  function setTokenSNR(
    uint256 tokenId,
    uint256 snr
  )
  public onlyExistedToken(tokenId) onlyTokenOwnerOrApproved(tokenId) {
    _tokenToTrustedRecord[tokenId].snr = snr;
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

  constructor(string memory name, string memory symbol) ERC721Metadata(name, symbol) public Ownable() {}
}

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
  bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  /// @notice Encodes some bytes to the base64 representation
  function encode(bytes memory data) internal pure returns (string memory) {
    uint256 len = data.length;
    if (len == 0) return "";

    // multiply by 4/3 rounded up
    uint256 encodedLen = 4 * ((len + 2) / 3);

    // Add some extra buffer at the end
    bytes memory result = new bytes(encodedLen + 32);

    bytes memory table = TABLE;

    assembly {
      let tablePtr := add(table, 1)
      let resultPtr := add(result, 32)

      for {
        let i := 0
      } lt(i, len) {

      } {
        i := add(i, 3)
        let input := and(mload(add(data, i)), 0xffffff)

        let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
        out := shl(224, out)

        mstore(resultPtr, out)

        resultPtr := add(resultPtr, 4)
      }

      switch mod(len, 3)
      case 1 {
        mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
      }
      case 2 {
        mstore(sub(resultPtr, 1), shl(248, 0x3d))
      }

      mstore(result, encodedLen)
    }

    return string(result);
  }
}
