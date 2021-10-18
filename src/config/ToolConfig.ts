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
    name: 'Pebble bag 🎒',
    path: '/pebble-bag',
    component: PebbleBag,
    tags: ['Pebble', 'IoT', 'Loot']
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
    name: 'DataPoint Stash 💰',
    path: '/datapoint-bank',
    component: DPBank,
    tags: ['Trusted Data', 'Pebble']
  })
];
