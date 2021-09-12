import { LangStore } from './lang';
import { GodStore } from './god';
import { TokenStore } from './token';
import { PebbleStore } from './pebble';
import { RecordStore } from '@/store/rec';

export class RootStore {
  lang = new LangStore();
  god = new GodStore(this);
  token = new TokenStore(this);
  pebble = new PebbleStore();
  rec = new RecordStore();
}
