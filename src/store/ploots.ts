import * as PebbleLootJSON from '../../build/contracts/PebbleLoot.json';
import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { PebbleLootState } from '@/store/lib/PebbleLootState';
import { Local7545 } from '../config/Local7545';
import pebbleLoots from '../constants/contracts/pebbleLoots.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';

export class ContractStore {
  rootStore: RootStore;
  address: string = "0x6b9806f475C63AF139b5c635edeCCA810c903DEd";
  abi: any[] = PebbleLootJSON.abi;
  network: NetworkState;
  balance: number = 5;
  contracts: { [key: number]: PebbleLootState } = {};

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [Local7545.chainId]: new PebbleLootState({...pebbleLoots, network: EthNetworkConfig} )
    }

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }
}
