import * as PebbleLootJSON from '../../constants/artifacts/contracts/PebbleLoot.sol/PebbleLoot.json';
import { NetworkState } from '@/store/lib/NetworkState';
import { BigNumberState } from '@/store/standard/BigNumberState';
import { BooleanState } from '@/store/standard/base';
import { makeObservable, observable } from 'mobx';
import { CallParams } from '../../../type';

export class PebbleLootState {
  abi = PebbleLootJSON.abi;
  name: string = '';
  symbol: string = '';
  address: string = '';

  network: NetworkState;
  balance: BigNumberState;
  info: {
    loading: BooleanState,
    [key: string]: any;
  } = {
    loading: new BooleanState()
  }

  constructor(args: Partial<PebbleLootState>) {
    Object.assign(this, args);
    this.balance = new BigNumberState({loading: true})
    makeObservable(this, {
      info: observable
    });
  }

  get nftName() {
    return this.network.execContract(Object.assign({address: this.address, abi: this.abi, method: 'name'}))
  }

  get nftSymbol() {
    return this.network.execContract(Object.assign({address: this.address, abi: this.abi, method: 'symbol'}))
  }

  claim(args: Partial<CallParams>) {
    console.log("Trying to claim token: ", args.params);
    return this.network.execContract(Object.assign({
      address: this.address,
      abi: this.abi,
      method: 'claim'
    },
      args))
  }

  balanceOf(args: Partial<CallParams>) {
    return this.network.execContract(Object.assign({
      address: this.address,
      abi: this.abi,
      method: 'balanceOf'
    },
      args))
  }

  tokenOfOwnerByIndex(args: Partial<CallParams>) {
    return this.network.execContract(Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'tokenOfOwnerByIndex'
      },
      args))
  }

  getTokenUri(args: Partial<CallParams>) {
    return this.network.execContract(Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'tokenURI'
      },
      args))
  }

  transferFrom(args: Partial<CallParams>) {
    return this.network.execContract(Object.assign({
      address: this.address,
      abi: this.abi,
      method: 'transferFrom'
    },
      args))
  }
}
