import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import { NFTStakeState } from '@/store/lib/NFTStakeState';
import nftStake from '../constants/contracts/nft_stake.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';

export class NftStakeStore {
  rootStore: RootStore;
  network: NetworkState;
  balance: number = 5;
  contracts: { [key: number]: NFTStakeState } = {};
  tokenUris: any[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new NFTStakeState({ ...nftStake[IotexTestnetConfig.chainId], network: EthNetworkConfig })
    }

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }
}
