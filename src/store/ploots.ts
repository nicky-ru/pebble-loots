import * as PebbleLootJSON from '../../build/contracts/PebbleLoot.json';
import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';

export class ContractStore {
  address: string = "0x6b9806f475C63AF139b5c635edeCCA810c903DEd";
  abi: any[] = PebbleLootJSON.abi;
  network: NetworkState;

  constructor() {
    makeAutoObservable(this);
  }
}
