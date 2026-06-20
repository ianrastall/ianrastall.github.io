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
  },
  {
    id: 'pong',
    name: 'Pong',
    description: 'A simple retro Pong-like game. First to 5 points wins.',
    category: 'Game',
    href: '/pong'
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Destroy the bricks with a ball and paddle. Multiple levels to clear!',
    category: 'Game',
    href: '/breakout'
  },
  {
    id: 'oregon-trail',
    name: 'Oregon Trail (1978)',
    description: 'The original 1978 BASIC terminal game ported directly to the browser. Can you make it to Oregon?',
    category: 'Game',
    href: '/oregon-trail'
  }
];
