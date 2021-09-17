import { ChainState } from '@/store/lib/ChainState';
import { TokenState } from '@/store/lib/TokenState';

export const Local7545 = new ChainState({
  name: 'Local7545',
  chainId: 1337,
  networkKey: 'local7545',
  rpcUrl: 'HTTP://127.0.0.1:7545',
  logoUrl: '/images/ganache.svg',
  explorerURL: 'https://bscscan.com',
  explorerName: 'BscScan',
  Coin: new TokenState({
    symbol: 'ETH',
    decimals: 18
  }),
  info: {
    blockPerSeconds: 3,
    multicallAddr: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    theme: {
      bgGradient: 'linear(to-r, #F6851B, #F5B638)'
    }
  }
});
