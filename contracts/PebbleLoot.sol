// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./TrueStream/interfaces/IRegistration.sol";
import "./Base64.sol";

contract PebbleLoot is ERC721, ReentrancyGuard, Ownable {

  /// @dev Contract events
  event RegistrationUpdated(
    address indexed registration
  );

  event MintingFeeUpdated(
    uint16 mintingFee
  );

  event FeeReceipientUpdated(
    address indexed feeReceipient
  );

  /// @notice Registration interface
  IRegistration public registration;

  /// @notice Minting fee
  uint16 public mintingFee;

  /// @notice Fee receipient
  address payable public feeReceipient;


  /// @notice Contract constructor
  constructor(
    string memory _name,
    string memory _symbol,
    address _registration,
    uint16 _mintingFee,
    address payable _feeReceipient
  )
  ERC721(_name, _symbol)
  Ownable()
  {
    registration = IRegistration(_registration);
    mintingFee = _mintingFee;
    feeReceipient = _feeReceipient;
  }

  /// @notice Generator of token URI
  /// @param tokenId Id of NFT
  function tokenURI(
    uint256 tokenId
  )
  public
  override
  pure
  returns (string memory)
  {
    string[3] memory parts;

    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    parts[1] = string(abi.encodePacked("Pebble Loot #", toString(tokenId)));

    parts[2] = '</text></svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2]));

    string memory name = string(abi.encodePacked('"name": "Pebble #', toString(tokenId), '"'));
    string memory description = string(abi.encodePacked('"description": "Pebble Loot is a real world data stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble Loot in any way you want."'));

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{', name, ',', description, ',"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  /// @notice Method for minting NFT
  /// @param tokenId IMEI of pebble device
  function claim(
    uint256 tokenId
  )
  public
  nonReentrant
  {
    require(tokenId > (10 ** 14 - 1) && tokenId < 10 ** 15, "Token ID invalid");
//    NOTE: disable ownership check during tests
//    address deviceOwner;
//    (,deviceOwner) = registration.find(toString(tokenId));
//    require(_msgSender() == deviceOwner, "You should own the device to mint this loot");
    _safeMint(_msgSender(), tokenId);
  }

  //////////
  // Admin /
  //////////

  /// @notice Method for updating TrueStream
  /// @notice registration contract
  /// @dev only admin
  /// @param _registration Registration address
  function updateRegistration(
    address _registration
  )
  public onlyOwner
  {
    registration = IRegistration(_registration);
    emit RegistrationUpdated(_registration);
  }

  /// @notice Method for updating minting fee
  /// @dev only admin
  /// @param _mintingFee Minting fee
  function updateMintingFee(
    uint16 _mintingFee
  )
  public onlyOwner
  {
    mintingFee = _mintingFee;
    emit MintingFeeUpdated(mintingFee);
  }

  /// @notice Method for updating fee receipient address
  /// @dev only admin
  /// @param _feeReceipient Fee receipient address
  function updateFeeReceipient(
    address payable _feeReceipient
  )
  public onlyOwner
  {
    feeReceipient = _feeReceipient;
    emit FeeReceipientUpdated(feeReceipient);
  }


  /////////////////////////
  // Internal and Private /
  /////////////////////////

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
