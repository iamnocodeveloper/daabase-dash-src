---
title: Plans and Limits
nextjs:
  metadata:
    title: 'Plans and Limits'
    description: 'daabase free and paid plan limits: space, projects, and what happens when you hit a limit.'
---

daabase runs on a generous free plan with no time limits and no credit card. Your apps never expire and you can create as many projects as you want.

## Free plan

| Dimension | Limit | When you reach it |
|---|---|---|
| Projects | Unlimited | — |
| Expiration | None | — |
| Data + files per project | 200 MB | Email warning at 80% · app becomes **read-only** at 100% |
| Bandwidth | Fair use (beta) | Warning, no cutoff |
| Concurrent connections / app | Soft cap ~100 | Graceful queue/reject |
| Anti-abuse | Verified email + native rate limits | Already enforced |

### What "read-only" means

When your app uses 100% of its space, it is switched to **read-only**:

- The engine rejects new writes with a `read-only` error.
- Your SDK blocks writes locally and surfaces the error to your UI.
- Reads, queries, and realtime always keep working.
- Your data is never deleted and can be exported at any time.

**You can always recover**: delete data to drop below the limit and your app automatically becomes writable again within a few minutes.

### The 80% warning

At 80% usage you'll get an email and a banner in the console so you can clean up or export before hitting the limit.

## Paid plans (coming soon)

| Plan | Space | Extra | Notes |
|---|---|---|---|
| Pro | 10 GB | $0.125/GB/mo | Backups, team members, priority support |
| Startup | 250 GB | $0.125/GB/mo | For larger apps and teams |

Paid plans map to the same enforcement machinery — you just get a bigger `max_bytes` per app.

## How usage is measured

Space is the total bytes your app uses:

- **Database**: triples and indexes (includes Postgres overhead so it matches what the engine reports)
- **Storage**: uploaded files

You can see exact numbers in the console under **Settings → Billing → Usage**.

## What happens if I go over?

Nothing bad. The app stops accepting writes until it's back under the limit, and the console shows exactly how much space you're using. This keeps everyone honest and the service reliable — and it's the natural moment to consider a paid plan.
