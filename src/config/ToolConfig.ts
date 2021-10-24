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
];
