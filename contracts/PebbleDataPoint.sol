// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Base64.sol";

import "./PebbleToken.sol";

/// @notice Contract for minting Pebble Data points NFTs
contract PebbleDataPoint is ERC721, Ownable {
  using SafeMath for uint256;
  using SafeMath for uint32;
  using SafeMath for uint8;
  using Counters for Counters.Counter;

  /// @notice events for the contract
  event TokenMinted (
    address indexed to,
    uint256 indexed tokenId
  );

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
  mapping (uint256 => DataPoint) public tokenToDataPoint;
  /// @notice Token Id => Token hash power
  /// Hash power will be used in calculating rewards in NFT Staking
  mapping (uint256 => uint8) public tokenToHashPower;
  /// @notice counter for auto incrementing id's
  Counters.Counter private _tokenIdCounter;

  constructor(
    PebbleToken _pbl,
    uint256 _burnMultiplier,
    address payable _feeReceipient
  ) ERC721("PebbleDataPoint", "PDP") {
    pbl = _pbl;
    burnMultiplier = _burnMultiplier;
    feeReceipient = _feeReceipient;
  }

  function safeMint(address to, DataPoint memory dataPoint) public {
    uint8 hashPower = calculateHashPower(dataPoint);
    uint256 pblToBurn = hashPower.mul(burnMultiplier);
    require(pbl.balanceOf(_msgSender()) >= pblToBurn + hashPower, "Minting: insufficient balance for minting NFT");
    pbl.burnFrom(_msgSender(), pblToBurn);
    pbl.transferFrom(_msgSender(), feeReceipient, hashPower);

    _safeMint(to, _tokenIdCounter.current());
    tokenToDataPoint[_tokenIdCounter.current()] = dataPoint;
    tokenToHashPower[_tokenIdCounter.current()] = hashPower;
    emit TokenMinted(to, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  /// @notice Generator of token URI
  /// @param tokenId Id of NFT
  function tokenURI(
    uint256 tokenId
  )
  public
  override
  view
  returns (string memory)
  {
    DataPoint memory dp = tokenToDataPoint[tokenId];

    string[3] memory parts;

    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    parts[1] = string(abi.encodePacked(
        "DataPoint Loot #", toString(tokenId), '</text><text x="10" y="40" class="base">',
          "snr: ", dp.snr, '</text><text x="10" y="60" class="base">',
          "vbat: ", dp.vbat, '</text><text x="10" y="80" class="base">',
          "latitude: ", dp.latitude, '</text><text x="10" y="100" class="base">',
          "longitude: ", dp.longitude, '</text><text x="10" y="120" class="base">',
          "gas resistance: ", dp.gasResistance, '</text><text x="10" y="140" class="base">',
          "temperature: ", dp.temperature, '</text><text x="10" y="160" class="base">'
    ));

    parts[2] = string(abi.encodePacked(
        "pressure: ", dp.pressure, '</text><text x="10" y="180" class="base">',
        "humidity: ", dp.humidity, '</text><text x="10" y="200" class="base">',
        "light: ", dp.light, '</text><text x="10" y="220" class="base">',
        "gyroscope: ", dp.gyroscope, '</text><text x="10" y="240" class="base">',
        "accelerometer: ", dp.accelerometer, '</text><text x="10" y="260" class="base">',
        "timestamp: ", dp.timestamp, '</text><text x="10" y="280" class="base">',
        "digging power: ", toString(tokenToHashPower[tokenId]), '</text></svg>'
      ));

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2]));
    string memory name = string(abi.encodePacked('"name": "Pebble #', toString(tokenId), '"'));
    string memory description = string(abi.encodePacked('"description": "Pebble Loot is a real world data stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble Loot in any way you want."'));

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{', name, ',', description, ',"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  /////////////////////////
  // Internal and Private /
  /////////////////////////

  /// @notice Method for calculating hash power of NFT
  function calculateHashPower(DataPoint memory dataPoint)
  internal
  pure
  returns (uint8 hashPower)
  {
    bytes4 hash = bytes4(
      keccak256(abi.encodePacked(
        dataPoint.snr, dataPoint.vbat, dataPoint.latitude, dataPoint.longitude,
        dataPoint.gasResistance, dataPoint.temperature, dataPoint.pressure, dataPoint.humidity,
        dataPoint.light, dataPoint.gyroscope, dataPoint.accelerometer, dataPoint.timestamp
      ))
    );

    if (uint32(hash).mod(1e9) == 0) {
      hashPower = 16;
    }
    else if (uint32(hash).mod(1e6) == 0) {
      hashPower = 8;
    }
    else if (uint32(hash).mod(1e3) == 0) {
      hashPower = 4;
    }
    else if (uint32(hash).mod(10) == 0) {
      hashPower = 2;
    } else {
      hashPower = 1;
    }
  }

  /// @notice Method for converting uint256 to string
  /// @param value Number to convert
  function toString(
    uint256 value
  )
  internal
  pure
  returns (string memory)
  {
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
}
