import type { Metadata } from 'next';
import Content from './content';

export const metadata: Metadata = {
  title: 'daabase Intern tools',
  description: 'Internal tools and analytics for daabase',
};

export default function Page() {
  return <Content />;
}
