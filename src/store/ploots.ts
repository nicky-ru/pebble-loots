import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { PebbleLootState } from '@/store/lib/PebbleLootState';
import { Local7545 } from '../config/Local7545';
import pebbleLoots from '../constants/contracts/pebbleLoots.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';

export class ContractStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number;
  contracts: { [key: number]: PebbleLootState } = {};
  tokenUris: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [Local7545.chainId]: new PebbleLootState({ ...pebbleLoots[Local7545.chainId], network: EthNetworkConfig }),
      [IotexTestnetConfig.chainId]: new PebbleLootState({ ...pebbleLoots[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    };

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

  updateBalance(bal: number) {
    this.balance = bal;
  }
}
