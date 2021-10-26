import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { LootStashState } from '@/store/lib/LootStashState';
import lootStash from '../constants/contracts/loot_stash.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';
import { BigNumber } from 'ethers';

class UserInfo {
  hashPower: number;
  numOfTokens: number;
}

export class LootStashStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number = 0;
  tokenIds: Array<number>;
  hashPower: Array<number>;
  contracts: { [key: number]: LootStashState } = {};
  tokenUris: any[];
  userInfo: UserInfo;
  pending: BigNumber = BigNumber.from(0);

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new LootStashState({ ...lootStash[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    };

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }

  async updateUserInfo() {
    const userInfo = await this.contracts[this.god.currentChain.chainId]
      .getUserInfo({ params: [this.god.currentNetwork.account] });
    const userInfoParsed = JSON.parse(JSON.stringify(userInfo));
    this.setUser(BigNumber.from(userInfoParsed[0]).toNumber(), BigNumber.from(userInfoParsed[1]).toNumber());
    await this.updateTokenIds();
    await this.updateHashPow();
    this.setBalance(this.tokenIds.length);
  }

  setUser(hashPower: number, numOfTokens: number) {
    this.userInfo = new UserInfo();
    Object.assign(this.userInfo, {
      hashPower: hashPower,
      numOfTokens: numOfTokens
    });
  }

  async updatePending() {
    const pending = await this.contracts[this.god.currentChain.chainId]
      .getPending({ params: [this.god.currentNetwork.account] });
    this.setPending(BigNumber.from(JSON.parse(JSON.stringify(pending))));
  }

  async updatePool() {
    await this.contracts[this.god.currentChain.chainId]
      .updatePool();
  }

  async calculateAPY() {
    const year = 365 * 24 * 60 * 60;
    const blocksAmount = year / 5;
    const pow = this.userInfo.hashPower;
    const pricePerPower = BigNumber.from("10000000000000000000");
    const spentForPower = pricePerPower.mul(pow);

    const accPblPerHashPowerReceipt = await this.contracts[this.god.currentChain.chainId]
      .getAccPblPerHashPowerUnit();
    const accPblPerHashPower = BigNumber.from(JSON.parse(JSON.stringify(accPblPerHashPowerReceipt)));
    const yearReward = accPblPerHashPower.mul(blocksAmount).mul(pow).div(1e12);
    return yearReward.mul(100).div(spentForPower);
  }

  setPending(pending: BigNumber) {
    this.pending = BigNumber.from(pending);
  }

  async updateTokenIds() {
    try {
      const tokenIdsRaw = await this.contracts[this.god.currentChain.chainId]
        .getMyStashedTokens();
      const tokenIds = JSON.parse(JSON.stringify(tokenIdsRaw)).map((tid) => {
        return BigNumber.from(tid).toNumber();
      });
      this.setTokenIds(tokenIds);
    } catch (e) {
      console.log("LootStashStore: updateTokenIds ", e)
    }
  }

  setTokenIds(tokenIds: Array<number>) {
    this.tokenIds = [...tokenIds];
  }

  async updateHashPow() {
    try {
      const newHashPowers = await Promise.all(
        this.tokenIds?.map(async (tid) => {
          const pow = await this.rootStore.dpLoot.contracts[this.god.currentChain.chainId]
            .getTokenHashPower({ params: [tid] });
          return BigNumber.from(JSON.parse(JSON.stringify(pow))).toNumber()
        })
      );
      this.setHashPower(newHashPowers);
    } catch (e) {
      console.log("LootStashStore: updateHashPow ", e)
    }
  }

  setHashPower(newHashPowers: Array<number>) {
    this.hashPower = [...newHashPowers];
  }

  setBalance(newBal: number) {
    this.balance = newBal;
  }
}
