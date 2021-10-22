import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { DatapointLootState } from '@/store/lib/DatapointLootState';
import datapointLoot from '../constants/contracts/datapoint_loot.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';
import { BigNumber } from 'ethers';

export class DatapointLootStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number;
  contracts: { [key: number]: DatapointLootState } = {};
  tokenUris: any[];
  tokenIds: number[];

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
    this.balance = BigNumber.from(JSON.parse(JSON.stringify(bal))).toNumber();
  }

  setTokenUris(uris: any[]) {
    this.tokenUris = [...uris];
  }

  setTokenIds(ids: number[]) {
    this.tokenIds = [...ids];
  }

  async approve() {
    try {
      await this.contracts[this.god.currentChain.chainId]
        .setApprovalForAll({
          params: [this.rootStore.stash.contracts[this.god.currentChain.chainId].address, true]
        });
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }

  async deposit(tokenId) {
    try {
      const tx = await this.rootStore.stash.contracts[this.god.currentChain.chainId].deposit({
        params: [tokenId]
      })
      await tx.wait(1);
      this.updateBalance();
    } catch (e) {
      alert(JSON.stringify(e.data.message))
    }
  }
}
