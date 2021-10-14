// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

import "./PebbleToken.sol";
import "./PebbleDataPoint.sol";

contract LootStake is Ownable, ReentrancyGuard, IERC721Receiver {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  /// @notice Events of the contract
  event Deposit(
    address indexed user,
    uint256 indexed tokenId,
    uint256 digPower
  );
  event Withdraw(
    address indexed user,
    uint256 indexed tokenId
  );

  /// @notice info of each user
  struct UserInfo {
    uint256 hashPower;  // sum of dig powers of all users staked tokens
    uint256 numOfTokens;  // amount of tokens staked
    mapping (uint256 => bool) tokenIds;  // ids of staked tokens
    uint256 rewardDebt;
  }

  /// @notice interface erc721 id
  bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;
  /// @notice the Pebble Token
  PebbleToken public pbl;
  /// @notice Address of Pebble NFT contract
  PebbleDataPoint public pNFT;
  /// @notice initial pbl reward per block
  uint256 public pblPerBlock;
  /// @notice User address => UserInfo
  mapping (address => UserInfo) public userInfo;
  /// @notice deposit fee address
  address payable public feeAddress;
  /// @notice Accumulative PBL tokens per hash power unit
  uint256 public accPblPerHashPowerUnit;
  /// @notice Total hash power of all users
  uint256 public totalHashPower;
  /// @notice Last block number that PBL distribution occurs.
  uint256 public lastRewardBlock;


  /// @notice Constructor of the contract
  constructor (
    PebbleToken _pbl,
    PebbleDataPoint _pNFT,
    uint256 _pblPerBlock,
    address payable _feeAddress
  )
  {
    pbl = _pbl;
    pNFT = _pNFT;
    pblPerBlock = _pblPerBlock;
    feeAddress = _feeAddress;
    accPblPerHashPowerUnit = 0;
    totalHashPower = 0;
    lastRewardBlock = block.number;
  }

  /// @notice View function to see pending PBL on frontend.
  function pendingPbl(address _user)
  public
  view
  returns (uint256 pending)
  {
    UserInfo storage user = userInfo[_user];
    return user.hashPower.mul(accPblPerHashPowerUnit).div(1e12).sub(user.rewardDebt);
  }

  /// @notice Update reward variables to be up-to-date
  function updatePool() public {
    if (totalHashPower == 0) {
      lastRewardBlock = block.number;
      return;
    }
    uint256 multiplier = getMultiplier(lastRewardBlock, block.number);
    uint256 pblReward = multiplier.mul(pblPerBlock);
    accPblPerHashPowerUnit = accPblPerHashPowerUnit.add(pblReward.mul(1e12).div(totalHashPower));
    lastRewardBlock = block.number;
  }

  /// @notice Deposit Pebble NFTs for PBL allocation.
  function deposit(uint256 _tokenId) public {
    require(pNFT.ownerOf(_tokenId) == _msgSender(), "Deposit: not owning item");
    updatePool();

    UserInfo storage user = userInfo[_msgSender()];
    if (user.hashPower > 0) {
      uint256 pending = pendingPbl(_msgSender());
      pbl.transfer(_msgSender(), pending);
    }

    pNFT.safeTransferFrom(
      _msgSender(),
      address(this),
      _tokenId
    );

    user.numOfTokens = user.numOfTokens.add(1);
    user.tokenIds[_tokenId] = true;
    user.hashPower = user.hashPower.add(pNFT.tokenToHashPower(_tokenId));
    user.rewardDebt = user.hashPower.mul(accPblPerHashPowerUnit).div(1e12);
    emit Deposit(_msgSender(), _tokenId, pNFT.tokenToHashPower(_tokenId));
  }

  /// @notice Withdraw Pebble NFTs from Loot Stake
  function withdraw(uint256 _tokenId) public {
    UserInfo storage user = userInfo[_msgSender()];
    require(user.tokenIds[_tokenId], "Withdraw: not good");
    updatePool();
    uint256 pending = pendingPbl(_msgSender());
    pbl.transfer(_msgSender(), pending);
    user.numOfTokens.sub(1);
    delete user.tokenIds[_tokenId];
    user.hashPower = user.hashPower.sub(pNFT.tokenToHashPower(_tokenId));
    user.rewardDebt = user.hashPower.mul(accPblPerHashPowerUnit).div(1e12);
    pNFT.safeTransferFrom(
      address(this),
      _msgSender(),
      _tokenId
    );
    emit Withdraw(_msgSender(), _tokenId);
  }

  // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
  function onERC721Received(
    address,
    address,
    uint256,
    bytes calldata
  ) external override pure returns (bytes4) {
    return this.onERC721Received.selector;
  }


  //////////
  // Admin /
  //////////

  /// @notice Method for updating address of
  /// Pebble NFTs
  function updateNftAddress(PebbleDataPoint _pNFT)
  external
  onlyOwner
  {
    pNFT = _pNFT;
  }

  /// @notice Method for updating address of
  /// PBL token
  function updatePBL(PebbleToken _pbl)
  external
  onlyOwner
  {
    pbl = _pbl;
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
