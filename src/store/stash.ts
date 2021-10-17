import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { LootStashState } from '@/store/lib/LootStashState';
import lootStash from '../constants/contracts/loot_stash.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';

export class LootStashStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number = 5;
  contracts: { [key: number]: LootStashState } = {};
  tokenUris: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new LootStashState({ ...lootStash[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    }

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }
}
