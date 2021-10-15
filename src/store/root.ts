import { LangStore } from './lang';
import { GodStore } from './god';
import { TokenStore } from './token';
import { PebbleStore } from './pebble';
import { RecordStore } from '@/store/rec';
import { ContractStore } from './ploots';
import { PebbleNftStore } from '@/store/pebbleNft';
import { NftStakeStore } from '@/store/stake';

export class RootStore {
  lang = new LangStore();
  god = new GodStore(this);
  token = new TokenStore(this);
  pebble = new PebbleStore();
  rec = new RecordStore();
  ploot = new ContractStore(this);
  pNft = new PebbleNftStore(this);
  nftStake = new NftStakeStore(this);
}
