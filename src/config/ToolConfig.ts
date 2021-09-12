import { ERC20 } from '../pages/ERC20';
import { Pebble } from '../pages/Pebble';
import { Devices } from '../pages/Devices';

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
    name: 'ERC20 Toolbox',
    path: '/erc20',
    component: ERC20,
    tags: ['ERC20']
  }),
  new Tool({
    name: 'Devices',
    path: '/devices',
    component: Devices,
    tags: ['IoT', 'Pebble']
  }),
];
