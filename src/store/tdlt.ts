import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { TrustedDataLootState } from '@/store/lib/TrustedDataLootState';
import { Local7545 } from '../config/Local7545';
import trustedDataLoots from '../constants/contracts/tdlt.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';

export class ContractStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number = 5;
  contracts: { [key: number]: TrustedDataLootState } = {};
  tokenUris: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [Local7545.chainId]: new TrustedDataLootState({...trustedDataLoots[Local7545.chainId], network: EthNetworkConfig} ),
      [IotexTestnetConfig.chainId]: new TrustedDataLootState({ ...trustedDataLoots[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    }

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }
  setTokenUris(uris: any[]) {
    this.tokenUris = uris;
  }
}
