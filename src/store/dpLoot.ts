import { makeAutoObservable, observable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { DatapointLootState } from '@/store/lib/DatapointLootState';
import datapointLoot from '../constants/contracts/datapoint_loot.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';
import { BigNumber } from 'ethers';
import axios from 'axios';
import Client from '../lib/apollo';
import { gql } from 'graphql-tag';
import { getMyUnstakedDpLoots } from '@/lib/queries'

export class DatapointLootStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number;
  contracts: { [key: number]: DatapointLootState } = {};
  tokenUris: any[];
  tokenIds: Array<number>;
  hashPow: Array<number>;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new DatapointLootState({ ...datapointLoot[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    };

    makeAutoObservable(this, {
      rootStore: false,
      hashPow: observable
    });
  }

  get god() {
    return this.rootStore.god;
  }

  async updateBalance() {
    const bal = await this.contracts[this.god.currentChain.chainId].balanceOf({ params: [this.god.currentNetwork.account] });
    this.setBalance(BigNumber.from(JSON.parse(JSON.stringify(bal))).toNumber());
  }

  async fetchLoots() {
    await this.updateTokenIds();
    await this.updateTokenUris();
  }

  async updateHashPow() {
    try {
      const newHashPowers = await Promise.all(
        this.tokenIds.map(async (tid) => {
          const pow = await this.contracts[this.god.currentChain.chainId].getTokenHashPower({ params: [tid] });
          return BigNumber.from(JSON.parse(JSON.stringify(pow))).toNumber()
        })
      );
      this.setHashPower(newHashPowers);
    } catch (e) {
      console.log("DatapointLootStore: updateHashPow ", e)
    }
  }

  async updateTokenIds() {
    const qry = await Client.query({query: gql(getMyUnstakedDpLoots), variables: {owner: this.god.currentNetwork.account}});

    const tokenIds = Array(qry.data.loots_datapoint.length);

    qry.data.loots_datapoint.map((dp, i) => {
      tokenIds[i] = BigNumber.from(dp.token_id).toString()
    })

    this.setTokenIds(tokenIds);
  }

  async updateTokenUris() {
    try {
      const tokenUris = await Promise.all(
        this.tokenIds.map(async (tid) => {
          const uri = await this.contracts[this.god.currentChain.chainId].getTokenUri({ params: [tid] });
          return await axios.get(uri.toString());
        })
      );

      this.setTokenUris(tokenUris);
    } catch (e) {
      console.log("DatapointLootStore: updateTokenUris ", e);
    }
  }

  setBalance(newBal: number) {
    this.balance = newBal;
  }

  setHashPower(hashpowers: Array<number>) {
    this.hashPow = [...hashpowers];
  }

  setTokenUris(uris: any[]) {
    this.tokenUris = [...uris];
  }

  setTokenIds(ids: Array<number>) {
    this.tokenIds = [...ids];
  }

  approve() {
    return this.contracts[this.god.currentChain.chainId].setApprovalForAll({
      params: [this.rootStore.stash.contracts[this.god.currentChain.chainId].address, true]
    });
    // try {
    //   await this.contracts[this.god.currentChain.chainId].setApprovalForAll({
    //     params: [this.rootStore.stash.contracts[this.god.currentChain.chainId].address, true]
    //   });
    // } catch (e) {
    //   alert(JSON.stringify(e.data.message));
    // }
  }

  deposit(tokenId) {
    return this.rootStore.stash.contracts[this.god.currentChain.chainId].deposit({
      params: [tokenId]
    });

    // try {
    //   const tx = await this.rootStore.stash.contracts[this.god.currentChain.chainId].deposit({
    //     params: [tokenId]
    //   });
    //   await tx.wait(1);
    //   this.updateBalance();
    //   this.rootStore.stash.updateUserInfo();
    // } catch (e) {
    //   alert(JSON.stringify(e.data.message));
    // }
  }

  async withdraw(tokenId) {
    return this.rootStore.stash.contracts[this.god.currentChain.chainId].withdraw({
      params: [tokenId]
    });
    // try {
    //   const tx = await this.rootStore.stash.contracts[this.god.currentChain.chainId].withdraw({
    //     params: [tokenId]
    //   });
    //   await tx.wait(1);
    //   this.updateBalance();
    //   this.rootStore.stash.updateUserInfo();
    // } catch (e) {
    //   alert(JSON.stringify(e.data.message));
    // }
  }
}
