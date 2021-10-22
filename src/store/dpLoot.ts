import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { DatapointLootState } from '@/store/lib/DatapointLootState';
import datapointLoot from '../constants/contracts/datapoint_loot.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';

export class DatapointLootStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number = 0;
  contracts: { [key: number]: DatapointLootState } = {};
  tokenUris: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new DatapointLootState({ ...datapointLoot[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    }

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }

  async updateBalance() {
    const bal = await this.contracts[this.god.currentChain.chainId].balanceOf({params: [this.god.currentNetwork.account]});
    // @ts-ignore
    this.balance = bal.toNumber();
  }

  setTokenUris(uris: any[]) {
    this.tokenUris = uris;
  }
}
