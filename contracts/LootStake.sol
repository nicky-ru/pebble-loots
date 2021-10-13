// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./PebbleToken.sol";

contract LootStake is Ownable, ReentrancyGuard {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  /// @notice info of each user
  struct UserInfo {
    uint256 hashPower;
    uint256[] stakedTokens;
    uint256 rewardDebt;
  }

  /// @notice interface erc721 id
  bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;
  /// @notice the Pebble Token
  PebbleToken public pbl;
  /// @notice initial pbl reward per block
  uint256 public pblPerBlock;
  /// @notice addresses of accepted to stacking NFTs
  mapping (address => bool) acceptedNFTs;
  /// @notice Info of each user that stakes Pebble NFTs
  mapping (address => UserInfo) public userInfo;
  /// @notice deposit fee address
  address payable public feeAddress;
  /// @notice Accumulative PBL tokens per hash power unit
  uint256 public accPblPerHashPowerUnit;
  /// @notice Total hash power of all users
  uint256 public totalHashPower;


  /// @notice Constructor of the contract
  constructor (
    PebbleToken _pbl,
    uint256 _pblPerBlock,
    address payable _feeAddress
  )
  {
    pbl = _pbl;
    pblPerBlock = _pblPerBlock;
    feeAddress = _feeAddress;
  }

  /// @notice View function to see pending PBL on frontend.
  function pendingPbl(address _user)
  public
  view
  returns (uint256 pending)
  {
    UserInfo storage user = userInfo[_user];

  }

  //////////
  // Admin /
  //////////

  /// @notice Method for adding new Pebble Loot NFT
  /// to the allowed list
  function addNftAddress(address _pebbleNFT)
  external
  onlyOwner
  {
    require(IERC165(_pebbleNFT).supportsInterface(INTERFACE_ID_ERC721), "Loot Stake: invalid nft address");
    acceptedNFTs[_pebbleNFT] = true;
  }

  /// @notice Method for removing Pebble Loot
  /// NFT address from allowed list
  function removeNftAddress(address _pebbleNFT)
  external
  onlyOwner
  {
    acceptedNFTs[_pebbleNFT] = false;
  }

  /////////////////////////
  // Internal and Private /
  /////////////////////////

  /// @notice Calculate reward multiplier over the given _from to _to block.
  function getMultiplier(uint256 _from, uint256 _to)
  internal
  pure
  returns (uint256)
  {
    return _to.sub(_from);
  }
}
