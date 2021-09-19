import * as PebbleLootJSON from '../../build/contracts/PebbleLoot.json';
import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { ethers } from 'ethers';

export class ContractStore {
  address: string = "0x6b9806f475C63AF139b5c635edeCCA810c903DEd";
  abi: any[] = PebbleLootJSON.abi;
  network: NetworkState;
  balance: number = 5;
  contract;

  constructor() {
    makeAutoObservable(this);
  }

  init(rpc: string) {
    const provider = ethers.getDefaultProvider(rpc);
    this.contract = new ethers.Contract(this.address, this.abi, provider);
  }

  setContract(contract) {
    this.contract = contract;
  }

  setBalance(balance: number) {
    this.balance = 10;
  }
}
