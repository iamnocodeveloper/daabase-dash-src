import type { Metadata } from 'next';
import Content from './content';

export const metadata: Metadata = {
  title: 'Whirlwind tour: Build a full-stack app with daabase',
  description: 'Build full-stack apps with daabase in 5-10 minutes!',
};

export default function Page() {
  return <Content />;
}
