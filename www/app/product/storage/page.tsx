import type { Metadata } from 'next';
import Content from './content';

const title = 'Storage - daabase';
const description =
  'Digital content is just another table in your database. No separate service needed.';

export const metadata: Metadata = {
  title,
  description,
  twitter: { card: 'summary_large_image' },
};

export default function Page() {
  return <Content />;
}
