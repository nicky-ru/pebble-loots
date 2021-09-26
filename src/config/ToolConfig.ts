import { ERC20 } from '../pages/ERC20';
import { Devices } from '../pages/Devices';
import { MyLoots } from '../pages/Loots';
import { Minting } from '../pages/Minting';
import { LootCharts } from '../pages/LootCharts';

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
    name: 'Devices',
    path: '/devices',
    component: Devices,
    tags: ['IoT', 'Pebble']
  }),
  new Tool({
    name: 'Loot gallery',
    path: '/myloots',
    component: MyLoots,
    tags: ['NFT', 'Pebble']
  }),
  new Tool({
    name: 'Mint Loot',
    path: '/mintLoot',
    component: Minting,
    tags: ['NFT', 'Loot', 'Minting']
  }),
  new Tool({
    name: 'Loot charts 🔥',
    path: '/lootcharts',
    component: LootCharts,
    tags: ['Real data', 'Loot']
  })
];
