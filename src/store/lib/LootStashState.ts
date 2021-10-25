import * as LootStashJSON from '../../constants/artifacts/contracts/LootStash.sol/LootStash.json';
import { NetworkState } from '@/store/lib/NetworkState';
import { BigNumberState } from '@/store/standard/BigNumberState';
import { BooleanState } from '@/store/standard/base';
import { makeObservable, observable } from 'mobx';
import { CallParams } from '../../../type';

export class LootStashState {
  abi = LootStashJSON.abi;
  name: string = '';
  symbol: string = '';
  address: string = '';

  network: NetworkState;
  balance: BigNumberState;
  info: {
    loading: BooleanState;
    [key: string]: any;
  } = {
    loading: new BooleanState()
  };

  constructor(args: Partial<LootStashState>) {
    Object.assign(this, args);
    this.balance = new BigNumberState({ loading: true });
    makeObservable(this, {
      info: observable
    });
  }

  deposit(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'deposit'
        },
        args
      )
    );
  }

  updatePool() {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'updatePool'
        }
      )
    )
  }

  getAccPblPerHashPowerUnit() {
    return this.network.execContract(
      Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'accPblPerHashPowerUnit'
      })
    )
  }

  withdraw(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'withdraw'
        },
        args
      )
    );
  }

  getMyStashedTokens() {
    return this.network.execContract(
      Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'getTokenIds'
      })
    );
  }

  getPending(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'pendingPbl'
        },
        args
      )
    );
  }

  getUserInfo(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'userInfo'
        },
        args
      )
    );
  }
}
