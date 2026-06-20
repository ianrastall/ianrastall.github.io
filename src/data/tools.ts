export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
}

export const tools: ToolMeta[] = [
  {
    id: 'pick-three',
    name: 'Pick 3',
    description: 'A classic, low-stress match-3 game to pass the time.',
    category: 'Game',
    href: '/pick-three'
  }
];
