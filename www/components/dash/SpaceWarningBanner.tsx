import Link from 'next/link';
import { useAuthedFetch } from '@/lib/auth';
import config from '@/lib/config';
import { AppsSubscriptionResponse } from '@/lib/types';
import { friendlyUsage } from './Billing';

export const MB_200 = 200 * 1024 * 1024;
const GB_10 = 10 * 1024 * 1024 * 1024;

function spaceLimitForPlan(subscriptionName: string): number {
  if (subscriptionName === 'Pro') return GB_10;
  return MB_200;
}

// Shows a banner when an app approaches (>=80%) or reaches (>=100%) its
// space limit. Reads the same usage data as the Billing tab.
export function SpaceWarningBanner({ appId }: { appId: string }) {
  const { data, isLoading, error } = useAuthedFetch<AppsSubscriptionResponse>(
    `${config.apiURI}/dash/apps/${appId}/billing`,
  );

  if (isLoading || error || !data) return null;

  const totalBytes =
    (data['total-app-bytes'] || 0) + (data['total-storage-bytes'] || 0);
  const limit = spaceLimitForPlan(data['subscription-name']);
  const pct = Math.min(100, Math.round((totalBytes / limit) * 100));

  if (pct < 80) return null;

  const isAtLimit = pct >= 100;

  return (
    <div
      className={
        isAtLimit
          ? 'flex items-center gap-2 border-b border-red-200 bg-red-50 py-2 pr-2 pl-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950 dark:text-red-200'
          : 'flex items-center gap-2 border-b border-amber-200 bg-amber-50 py-2 pr-2 pl-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-200'
      }
    >
      <p className="grow text-center">
        {isAtLimit ? (
          <>
            <span className="font-semibold">
              This app reached its {friendlyUsage(limit)} space limit and is
              now read-only.
            </span>{' '}
            Delete data to keep writing. Your data is never deleted and stays
            exportable.
          </>
        ) : (
          <>
            <span className="font-semibold">
              You've used {pct}% of this app's {friendlyUsage(limit)} free
              space.
            </span>{' '}
            Clean up data or export before the app becomes read-only.
          </>
        )}{' '}
        <Link
          href="/docs/limits"
          className="whitespace-nowrap underline underline-offset-2"
        >
          Learn about limits
        </Link>
      </p>
    </div>
  );
}
