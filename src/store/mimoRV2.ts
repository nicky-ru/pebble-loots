import { makeAutoObservable } from 'mobx';
import { NetworkState } from '@/store/lib/NetworkState';
import mimoRouter from '../constants/contracts/MimoV2Router02.json';
import { RootStore } from '@/store/root';
import { EthNetworkConfig } from '../config/NetworkConfig';
import { IotexTestnetConfig } from '../config/IotexTestnetConfig';
import { MimoRouterState } from '@/store/lib/MimoRouterState';
import { IotexMainnetConfig } from '../config/IotexMainnetConfig';
import BigNumber from 'bignumber.js';

export class MimoRouterStore {
  rootStore: RootStore;
  network: NetworkState;
  contracts: { [key: number]: MimoRouterState } = {};

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.contracts = {
      [IotexTestnetConfig.chainId]: new MimoRouterState({
        abi: mimoRouter[IotexTestnetConfig.chainId].abi,
        address: mimoRouter[IotexTestnetConfig.chainId].address,
        network: EthNetworkConfig
      }),
      [IotexMainnetConfig.chainId]: new MimoRouterState({
        abi: mimoRouter[IotexTestnetConfig.chainId].abi,
        address: mimoRouter[IotexTestnetConfig.chainId].address,
        network: EthNetworkConfig
      })
    };

    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get god() {
    return this.rootStore.god;
  }

  async getFactory() {
    return this.contracts[this.god.currentChain.chainId].factory();
  }

  async getAmountsOut(amountIn: string, address1: string, address2: string) {
    const wiotxAddress = '0xff5Fae9FE685B90841275e32C348Dc4426190DB0';
    const pblAddress = '0x9a5C9878E89A0dC89d1Ee6cABcfe4E5f11EdB26c';

    return this.contracts[this.god.currentChain.chainId]
      .getAmountsOut({
        params: [
          amountIn,
          [wiotxAddress, pblAddress]
        ]
      })
  }

  async swapETHForExactTokens(amountIn: BigNumber, amountOut: BigNumber) {
    const blockN = await EthNetworkConfig.ethers.getBlockNumber();
    const block = await EthNetworkConfig.ethers.getBlock(blockN);
    const deadline = block.timestamp + 100000;

    const wiotxAddress = '0xff5Fae9FE685B90841275e32C348Dc4426190DB0';
    const pblAddress = '0x9a5C9878E89A0dC89d1Ee6cABcfe4E5f11EdB26c';

    return this.contracts[this.god.currentChain.chainId]
      .swapETHForExactTokens({
        params: [
          amountOut.toString(10),
          [wiotxAddress, pblAddress],
          this.god.currentNetwork.account,
          deadline,
          this.god.currentNetwork.account
        ],
        options: {
          value: amountIn.toString(10)
        }
      })
  }

  async swapExactETHForTokens(amountOutMin: BigNumber, amountIn: BigNumber) {
    const blockN = await EthNetworkConfig.ethers.getBlockNumber();
    const block = await EthNetworkConfig.ethers.getBlock(blockN);
    const deadline = block.timestamp + 100000;

    const wiotxAddress = '0xff5Fae9FE685B90841275e32C348Dc4426190DB0';
    const pblAddress = '0x9a5C9878E89A0dC89d1Ee6cABcfe4E5f11EdB26c';

    return this.contracts[this.god.currentChain.chainId]
      .swapExactETHForTokens({
        params: [
          amountOutMin.toString(10),
          [wiotxAddress, pblAddress],
          this.god.currentNetwork.account,
          deadline,
          this.god.currentNetwork.account
        ],
        options: {
          value: amountIn.toString(10)
        }
      })
  }

  async swapTokensForExactETH(amountOut: BigNumber, amountInMax: BigNumber) {
    const blockN = await EthNetworkConfig.ethers.getBlockNumber();
    const block = await EthNetworkConfig.ethers.getBlock(blockN);
    const deadline = block.timestamp + 100000;

    const wiotxAddress = '0xff5Fae9FE685B90841275e32C348Dc4426190DB0';
    const pblAddress = '0x9a5C9878E89A0dC89d1Ee6cABcfe4E5f11EdB26c';

    return this.contracts[this.god.currentChain.chainId]
      .swapTokensForExactETH({
        params: [
          amountOut.toString(10),
          amountInMax.toString(10),
          [pblAddress, wiotxAddress],
          this.god.currentNetwork.account,
          deadline,
          this.god.currentNetwork.account
        ]
      })
  }

  async swapExactTokensForETH(amountIn: BigNumber, amountOutMin: BigNumber) {
    const blockN = await EthNetworkConfig.ethers.getBlockNumber();
    const block = await EthNetworkConfig.ethers.getBlock(blockN);
    const deadline = block.timestamp + 100000;

    const wiotxAddress = '0xff5Fae9FE685B90841275e32C348Dc4426190DB0';
    const pblAddress = '0x9a5C9878E89A0dC89d1Ee6cABcfe4E5f11EdB26c';

    return this.contracts[this.god.currentChain.chainId]
      .swapExactTokensForETH({
        params: [
          amountIn.toString(10),
          amountOutMin.toString(10),
          [pblAddress, wiotxAddress],
          this.god.currentNetwork.account,
          deadline,
          this.god.currentNetwork.account
        ]
      })
  }
}
