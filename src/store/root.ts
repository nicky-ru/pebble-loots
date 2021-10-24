import { LangStore } from './lang';
import { GodStore } from './god';
import { TokenStore } from './token';
import { PebbleStore } from './pebble';
import { RecordStore } from '@/store/rec';
import { ContractStore } from './ploots';
import { DatapointLootStore } from '@/store/dpLoot';
import { LootStashStore } from '@/store/stash';
import { TabsStore } from '@/store/tabs';
import { LoadingStore } from '@/store/loading';

export class RootStore {
  lang = new LangStore();
  god = new GodStore(this);
  token = new TokenStore(this);
  pebble = new PebbleStore();
  rec = new RecordStore(this);
  ploot = new ContractStore(this);
  dpLoot = new DatapointLootStore(this);
  stash = new LootStashStore(this);
  tabs = new TabsStore();
  load = new LoadingStore();
}
