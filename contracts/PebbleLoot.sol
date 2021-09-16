// SPDX-License-Identifier: MIT
pragma solidity ^0.5.13;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";

contract PebbleLoot is ERC721Enumerable, ReentrancyGuard, Ownable, ERC721Metadata {

  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }

  function getSnr() public view returns (string memory) {
    uint256 snr = 2;
    string memory output = string(abi.encodePacked("SNR: ", toString(snr)));
    return output;
  }

  function getVbat() public view returns (string memory) {
    uint256 vbat = 4;
    string memory output = string(abi.encodePacked("VBAT: ", toString(vbat)));
    return output;
  }

  function getLatitude() public view returns (string memory) {
    uint256 latitude = 3050;
    string memory output = string(abi.encodePacked("Latitude: ", toString(latitude)));
    return output;
  }

  function getLongitude() public view returns (string memory) {
    uint256 longitude = 11448;
    string memory output = string(abi.encodePacked("Longitude: ", toString(longitude)));
    return output;
  }

  function getGasRes() public view returns (string memory) {
    uint256 gas_resistance = 1166811;
    string memory output = string(abi.encodePacked("Gas resistance: ", toString(gas_resistance)));
    return output;
  }

  function getTemperature() public view returns (string memory) {
    uint256 temperature = 36;
    string memory output = string(abi.encodePacked("Temperature: ", toString(temperature)));
    return output;
  }

  function getPressure() public view returns (string memory) {
    uint256 pressure = 1003;
    string memory output = string(abi.encodePacked("Pressure: ", toString(pressure)));
    return output;
  }

  function getHumidity() public view returns (string memory) {
    uint256 humidity = 55;
    string memory output = string(abi.encodePacked("Humidity: ", toString(humidity)));
    return output;
  }

  function getLight() public view returns (string memory) {
    uint256 light = 1639;
    string memory output = string(abi.encodePacked("Light: ", toString(light)));
    return output;
  }

  function getGyroscope() public view returns (string memory) {
    uint256 gyroscope = 0;
    string memory output = string(abi.encodePacked("Gyroscope: ", toString(gyroscope)));
    return output;
  }

  function getAccelerometer() public view returns (string memory) {
    uint256 accelerometer = 0;
    string memory output = string(abi.encodePacked("Accelerometer: ", toString(accelerometer)));
    return output;
  }

  function tokenURI(uint256 tokenId) public view returns (string memory) {
    string[23] memory parts;

    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    parts[1] = getSnr();

    parts[2] = '</text><text x="10" y="40" class="base">';

    parts[3] = getVbat();

    parts[4] = '</text><text x="10" y="60" class="base">';

    parts[5] = getLatitude();

    parts[6] = '</text><text x="10" y="80" class="base">';

    parts[7] = getLongitude();

    parts[8] = '</text><text x="10" y="100" class="base">';

    parts[9] = getHumidity();

    parts[10] = '</text><text x="10" y="120" class="base">';

    parts[11] = getPressure();

    parts[12] = '</text><text x="10" y="140" class="base">';

    parts[13] = getTemperature();

    parts[14] = '</text><text x="10" y="160" class="base">';

    parts[15] = getGasRes();

    parts[16] = '</text><text x="10" y="180" class="base">';

    parts[17] = getLight();

    parts[18] = '</text><text x="10" y="200" class="base">';

    parts[19] = getGyroscope();

    parts[20] = '</text><text x="10" y="220" class="base">';

    parts[21] = getAccelerometer();

    parts[22] = '</text></svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
    output = string(abi.encodePacked(output, parts[7], parts[8], parts[9], parts[10], parts[11], parts[12], parts[13], parts[14]));
    output = string(abi.encodePacked(output, parts[15], parts[16], parts[17], parts[18], parts[19], parts[20], parts[21], parts[22]));

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag #', toString(tokenId), '", "description": "Pebble Loot is a real world data stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble Loot in any way you want.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  function claim(uint256 tokenId) public nonReentrant {
    require(tokenId > 0 && tokenId < 7778, "Token ID invalid");
    _safeMint(_msgSender(), tokenId);
  }

  function ownerClaim(uint256 tokenId) public nonReentrant onlyOwner {
    require(tokenId > 7777 && tokenId < 8001, "Token ID invalid");
    _safeMint(owner(), tokenId);
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

  constructor() ERC721Metadata("Pebble Loot", "PLOOT") public Ownable() {}
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
