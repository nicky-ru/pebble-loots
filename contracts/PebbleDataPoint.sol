// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./PebbleToken.sol";

/// @notice Contract for minting Pebble Data points NFTs
contract PebbleDataPoint is ERC721, ERC721URIStorage, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;


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
  /// @notice Burn multiplier
  uint256 public burnMultiplier;
  /// @notice Token Id => Data point structure
  mapping (uint256 => DataPoint) public tokenToDataPoint;
  /// @notice Token Id => Token hash power
  /// Hash power will be used in calculating rewards in NFT Staking
  mapping (uint256 => uint8) public tokenToHashPower;
  /// @notice counter for auto incrementing id's
  Counters.Counter private _tokenIdCounter;

  constructor(
    PebbleToken _pbl,
    uint256 _burnMultiplier
  ) ERC721("PebbleDataPoint", "PDP") {
    pbl = _pbl;
    burnMultiplier = _burnMultiplier;
  }

  function safeMint(address to, DataPoint memory dataPoint) public onlyOwner {
    uint8 hashPower = calculateHashPower(dataPoint);
    require(pbl.balanceOf(_msgSender()) >= hashPower, "PebbleDataPoint: insufficient balance for minting NFT");
    pbl.burnFrom(_msgSender(), hashPower);

    _safeMint(to, _tokenIdCounter.current());
    tokenToDataPoint[_tokenIdCounter.current()] = dataPoint;
    tokenToHashPower[_tokenIdCounter.current()] = hashPower;
    _tokenIdCounter.increment();
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
    bytes32 hash = keccak256(abi.encodePacked(
      dataPoint.snr, dataPoint.vbat, dataPoint.latitude, dataPoint.longitude,
        dataPoint.gasResistance, dataPoint.temperature, dataPoint.pressure, dataPoint.humidity,
        dataPoint.light, dataPoint.gyroscope, dataPoint.accelerometer, dataPoint.timestamp
      ));

    if (uint256(hash).mod(2 ** 4) == 0) {
      hashPower = 2;
    }
    else if (uint256(hash).mod(2 ** 8) == 0) {
      hashPower = 4;
    }
    else if (uint256(hash).mod(2 ** 16) == 0) {
      hashPower = 8;
    }
    else if (uint256(hash).mod(2 ** 32) == 0) {
      hashPower = 16;
    } else {
      hashPower = 1;
    }
  }

  /// @notice The following functions are overrides required by Solidity.

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
