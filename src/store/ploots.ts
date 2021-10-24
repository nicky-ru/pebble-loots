import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { PebbleLootState } from '@/store/lib/PebbleLootState';
import pebbleLoots from '../constants/contracts/pebbleLoots.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';
import { BigNumber } from 'ethers';
import axios from 'axios';

export class ContractStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number;
  contracts: { [key: number]: PebbleLootState } = {};
  tokenUris: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new PebbleLootState({ ...pebbleLoots[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    };

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }

  async updateBalance() {
    const balance = await this.contracts[this.god.currentChain.chainId]
      .balanceOf({ params: [this.god.currentNetwork.account] });
    const bal = BigNumber.from(JSON.parse(JSON.stringify(balance)).hex);
    this.setBalance(bal.toNumber());
  }

  setBalance(bal: number) {
    this.balance = bal;
  }

  async fetchLoots() {
    const tokenIds = Array(this.balance);

    for (let i = 0; i < this.balance; i++) {
      tokenIds[i] = await this.contracts[this.god.currentChain.chainId]
        .tokenOfOwnerByIndex({ params: [this.god.currentNetwork.account, i] });
    }
    const tokenUris = await Promise.all(
      tokenIds.map(async (tid) => {
        const uri = await this.contracts[this.god.currentChain.chainId]
          .getTokenUri({ params: [tid.toNumber()] });
        return await axios.get(uri.toString());
      })
    );

    this.setTokenUris(tokenUris);
  }

  setTokenUris(uris: any[]) {
    this.tokenUris = uris;
  }
}
