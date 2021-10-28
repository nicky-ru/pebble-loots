// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './Base64.sol';

import './PebbleToken.sol';

/// @notice Contract for minting Pebble Data points NFTs
contract DatapointLoot is ERC721, ERC721Enumerable, Ownable {
  using SafeMath for uint256;
  using SafeMath for uint32;
  using SafeMath for uint16;
  using Counters for Counters.Counter;

  /// @notice events for the contract
  event TokenMinted(address indexed to, uint256 indexed tokenId);

  struct DataPoint {
    string snr;
    string vbat;
    string latitude;
    string longitude;
    string gasResistance;
    string temperature;
    string pressure;
    string humidity;
    string light;
    string gyroscope;
    string accelerometer;
    string timestamp;
  }

  /// @notice Pebble Token is required for minting
  PebbleToken public pbl;
  /// @notice Burn multiplier for calculating mint fee
  uint256 public burnMultiplier;
  /// @notice Fee receipient
  address payable feeReceipient;
  /// @notice Token Id => Data point structure
  mapping(uint256 => DataPoint) public tokenToDataPoint;
  /// @notice Token Id => Token hash power
  /// Hash power will be used in calculating rewards in NFT Staking
  mapping(uint256 => uint16) public tokenToHashPower;
  /// @notice counter for auto incrementing id's
  Counters.Counter private _tokenIdCounter;

  constructor(
    PebbleToken _pbl,
    address payable _feeReceipient
  ) ERC721('Datapoint Loot', 'DLT') {
    pbl = _pbl;
    burnMultiplier = 1 ether;
    feeReceipient = _feeReceipient;
  }

  function safeMint(address to, DataPoint memory dataPoint) public {
    uint16 hashPower = calculateHashPower(dataPoint);
    uint256 pblToBurn = hashPower.mul(burnMultiplier);
    require(pbl.allowance(_msgSender(), address(this)) >= pblToBurn.add(1 ether), 'Minting: insufficient balance for minting NFT');
    pbl.burnFrom(_msgSender(), pblToBurn);
    pbl.transferFrom(_msgSender(), feeReceipient, 1 ether);

    _safeMint(to, _tokenIdCounter.current());
    tokenToDataPoint[_tokenIdCounter.current()] = dataPoint;
    tokenToHashPower[_tokenIdCounter.current()] = hashPower;
    emit TokenMinted(to, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  /// @notice Generator of token URI
  /// @param tokenId Id of NFT
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    string memory output = string(
      abi.encodePacked(
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">Datapoint Loot #',
        toString(tokenId),
        '</text><text x="10" y="40" class="base">snr: ',
        tokenToDataPoint[tokenId].snr,
        '</text><text x="10" y="60" class="base">vbat: ',
        tokenToDataPoint[tokenId].vbat,
        '</text><text x="10" y="80" class="base">latitude: ',
        tokenToDataPoint[tokenId].latitude,
        '</text><text x="10" y="100" class="base">longitude: ',
        tokenToDataPoint[tokenId].longitude,
        '</text><text x="10" y="120" class="base">gas resistance: ',
        tokenToDataPoint[tokenId].gasResistance,
        '</text><text x="10" y="140" class="base">temperature: ',
        tokenToDataPoint[tokenId].temperature,
        '</text><text x="10" y="160" class="base">pressure: ',
        tokenToDataPoint[tokenId].pressure,
        '</text><text x="10" y="180" class="base">humidity: '
      )
    );

    output = string(
      abi.encodePacked(
        output,
        tokenToDataPoint[tokenId].humidity,
        '</text><text x="10" y="200" class="base">light: ',
        tokenToDataPoint[tokenId].light,
        '</text><text x="10" y="220" class="base">gyroscope: ',
        tokenToDataPoint[tokenId].gyroscope,
        '</text><text x="10" y="240" class="base">accelerometer: ',
        tokenToDataPoint[tokenId].accelerometer,
        '</text><text x="10" y="260" class="base">timestamp: ',
        tokenToDataPoint[tokenId].timestamp,
        '</text><text x="10" y="280" class="base">digging power: ',
        toString(tokenToHashPower[tokenId]),
        '</text><text x="10" y="300" class="base">msg origin and integrity are verified</text></svg>'
      )
    );

    string memory name = string(abi.encodePacked('"name": "Datapoint Loot #', toString(tokenId), '"'));
    string memory description = string(
      abi.encodePacked(
        '"description": "Datapoint Loot is a verified and trusted real world datapoint stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble datapoint Loot in any way you want."'
      )
    );

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{', name, ',', description, ',"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  //////////
  // Admin /
  //////////

  /// @notice Method for updating burn multiplier
  /// @dev only admin
  function updateBurnMultiplier(uint256 _burnMultiplier) external onlyOwner {
    burnMultiplier = _burnMultiplier;
  }

  /// @notice Method for updating fee receipient
  function updateFeeReceipient(address payable _feeReceipient) external onlyOwner {
    feeReceipient = _feeReceipient;
  }

  /////////////////////////
  // Internal and Private /
  /////////////////////////

  /// @notice Method for calculating hash power of NFT
  function calculateHashPower(DataPoint memory dataPoint) public pure returns (uint16 hashPower) {
    bytes4 hash = bytes4(
      keccak256(
        abi.encodePacked(
          dataPoint.snr,
          dataPoint.vbat,
          dataPoint.latitude,
          dataPoint.longitude,
          dataPoint.gasResistance,
          dataPoint.temperature,
          dataPoint.pressure,
          dataPoint.humidity,
          dataPoint.light,
          dataPoint.gyroscope,
          dataPoint.accelerometer,
          dataPoint.timestamp
        )
      )
    );

    if (uint32(hash).mod(1e9) == 0) {
      hashPower = 512;
    } else if (uint32(hash).mod(1e8) == 0) {
      hashPower = 256;
    } else if (uint32(hash).mod(1e7) == 0) {
      hashPower = 128;
    } else if (uint32(hash).mod(1e6) == 0) {
      hashPower = 64;
    } else if (uint32(hash).mod(1e5) == 0) {
      hashPower = 32;
    } else if (uint32(hash).mod(1e4) == 0) {
      hashPower = 16;
    } else if (uint32(hash).mod(1e3) == 0) {
      hashPower = 8;
    } else if (uint32(hash).mod(100) == 0) {
      hashPower = 4;
    } else if (uint32(hash).mod(10) == 0) {
      hashPower = 2;
    } else {
      hashPower = 1;
    }
  }

  /// @notice Method for converting uint256 to string
  /// @param value Number to convert
  function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

    if (value == 0) {
      return '0';
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

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
