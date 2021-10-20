import { ERC20 } from '../pages/ERC20';
import { DPBank } from '../pages/DPBank';
import { PebbleBag } from '../pages/PebbleBag';

class Tool {
  name: string;
  path: string;
  component: any;
  tags: string[];
  constructor(args: Partial<Tool>) {
    Object.assign(this, args);
  }
}

export const ToolConfig = [
  new Tool({
    name: 'Machinaverse Passports 🪐',
    path: '/pebble-bag',
    component: PebbleBag,
    tags: ['DID', 'IoT', 'Metaverse']
  }),
  // new Tool({
  //   name: 'Devices',
  //   path: '/devices',
  //   component: Devices,
  //   tags: ['IoT', 'Pebble']
  // }),
  // new Tool({
  //   name: 'Loot gallery',
  //   path: '/myloots',
  //   component: MyLoots,
  //   tags: ['NFT', 'Pebble']
  // }),
  // new Tool({
  //   name: 'Mint Loot',
  //   path: '/mintLoot',
  //   component: Minting,
  //   tags: ['NFT', 'Loot', 'Minting']
  // }),
  // new Tool({
  //   name: 'Loot charts 🔥',
  //   path: '/lootcharts',
  //   component: LootCharts,
  //   tags: ['Real data', 'Loot']
  // }),
  new Tool({
    name: 'Intergalactic mine 💎',
    path: '/datapoint-bank',
    component: DPBank,
    tags: ['Ore', 'PoW']
  })
];
