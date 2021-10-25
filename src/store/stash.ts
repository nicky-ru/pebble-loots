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
  tokenIds: [];
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

  setPending(pending: BigNumber) {
    console.log("pending: ", pending.toString());
    this.pending = BigNumber.from(pending);
  }
}
