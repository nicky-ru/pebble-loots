import { NetworkState } from '@/store/lib/NetworkState';
import { CallParams } from '../../../type';

export class MimoRouterState {
  abi: any[];
  address: string = '';

  network: NetworkState;

  constructor(args: Partial<MimoRouterState>) {
    Object.assign(this, args);
  }

  factory() {
    return this.network.execContract(
      Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'WETH'
      })
    )
  }

  swapETHForExactTokens(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'swapETHForExactTokens'
        },
        args
      )
    );
  }

  swapExactETHForTokens(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'swapExactETHForTokens'
        },
        args
      )
    );
  }

  swapTokensForExactETH(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'swapTokensForExactETH'
        },
        args
      )
    );
  }

  swapExactTokensForETH(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign(
        {
          address: this.address,
          abi: this.abi,
          method: 'swapExactTokensForETH'
        },
        args
      )
    );
  }

  getAmountsOut(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'getAmountsOut'
      },
        args)
    )
  }

  getAmountsIn(args: Partial<CallParams>) {
    return this.network.execContract(
      Object.assign({
        address: this.address,
        abi: this.abi,
        method: 'getAmountsIn'
      },
        args)
    )
  }

  //
  // updatePool() {
  //   return this.network.execContract(
  //     Object.assign(
  //       {
  //         address: this.address,
  //         abi: this.abi,
  //         method: 'updatePool'
  //       }
  //     )
  //   )
  // }

}
