// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import './TrueStream/interfaces/IRegistration.sol';
import './Base64.sol';

contract PebbleLoot is ERC721, ReentrancyGuard, ERC721Enumerable, Ownable {
  /// @dev Contract events
  event RegistrationUpdated(address indexed registration);

  event MintingFeeUpdated(uint16 mintingFee);

  event FeeReceipientUpdated(address indexed feeReceipient);

  event TokenMinted(address owner, uint256 tokenId);

  /// @notice Registration interface
  IRegistration public registration;

  /// @notice Minting fee
  uint16 public mintingFee;

  /// @notice Fee receipient
  address payable public feeReceipient;

  /// @notice Contract constructor
  constructor(
    address _registration,
    address payable _feeReceipient
  ) ERC721('Pebble Loot', 'PLT') Ownable() {
    registration = IRegistration(_registration);
    mintingFee = 0;
    feeReceipient = _feeReceipient;
  }

  string[] private skins = ['Cat', 'Dog', 'Bull', 'Bear', 'Wolf', 'Fox', 'Unicorn', 'Ape', 'Shark', 'Frog', 'Whale'];

  string[] private colors = ['Black', 'White', 'Blue', 'Red', 'Yellow', 'Pink'];

  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }

  function getSkin(uint256 tokenId) public view returns (string memory) {
    return pluck(tokenId, 'SKIN', skins);
  }

  function pluck(
    uint256 tokenId,
    string memory keyPrefix,
    string[] memory sourceArray
  ) internal view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked(keyPrefix, toString(tokenId))));
    string memory output = sourceArray[rand % sourceArray.length];
    string memory color = colors[rand % colors.length];
    output = string(abi.encodePacked(color, ' Robo', output));
    return output;
  }

  /// @notice Generator of token URI
  /// @param tokenId Id of NFT
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    string memory output = string(
      abi.encodePacked(
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">',
        'Pebble Soul #',
        toString(tokenId),
        '</text><text x="10" y="40" class="base">',
        getSkin(tokenId),
        '</text></svg>'
      )
    );

    string memory name = string(abi.encodePacked('"name": "Pebble IMEI #', toString(tokenId), '"'));
    string memory description = string(
      abi.encodePacked(
        '"description": "Pebble Loot is a real world data stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Pebble Loot in any way you want."'
      )
    );

    string memory json = Base64.encode(bytes(string(abi.encodePacked('{', name, ',', description, ',"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked('data:application/json;base64,', json));

    return output;
  }

  /// @notice Method for minting NFT
  /// @param tokenId IMEI of pebble device
  function claim(uint256 tokenId) external payable nonReentrant {
    require(tokenId > (10**14 - 1) && tokenId < 10**15, 'Claim: Token ID is invalid');
    (, address deviceOwner) = registration.find(toString(tokenId));
    require(_msgSender() == deviceOwner, 'You should own the device to mint this loot');
    require(msg.value >= mintingFee, 'Claim: not enough minting fee');
    _safeMint(_msgSender(), tokenId);
    emit TokenMinted(_msgSender(), tokenId);
  }

  //////////
  // Admin /
  //////////

  /// @notice Method for updating TrueStream
  /// @notice registration contract
  /// @dev only admin
  /// @param _registration Registration address
  function updateRegistration(address _registration) public onlyOwner {
    registration = IRegistration(_registration);
    emit RegistrationUpdated(_registration);
  }

  /// @notice Method for updating minting fee
  /// @dev only admin
  /// @param _mintingFee Minting fee
  function updateMintingFee(uint16 _mintingFee) public onlyOwner {
    mintingFee = _mintingFee;
    emit MintingFeeUpdated(mintingFee);
  }

  /// @notice Method for updating fee receipient address
  /// @dev only admin
  /// @param _feeReceipient Fee receipient address
  function updateFeeReceipient(address payable _feeReceipient) public onlyOwner {
    feeReceipient = _feeReceipient;
    emit FeeReceipientUpdated(feeReceipient);
  }

  /////////////////////////
  // Internal and Private /
  /////////////////////////

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
