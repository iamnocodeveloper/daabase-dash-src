---
nextjs:
  metadata:
    title: 'Migrate from daabase Cloud'
    description: 'Move an daabase Cloud app to self-hosted daabase.'
---

Migrating from daabase Cloud happens in two phases:

1. **Rehearse the migration:** Set up self-hosted daabase and restore a test backup. This confirms that everything works and gives you an estimate for downtime.
2. **Cut over:** Pause writes, restore a fresh backup, and point your app at your self-hosted daabase.

## Rehearse the migration

### Set up self-hosted daabase

If you haven't already, set up self-hosting with our [VPS](/docs/self-hosting/vps) or
[AWS](/docs/self-hosting/aws) guide. Make sure you can log in to the dashboard,
create an app, query it, and write data.

Before restoring your app:

- [Configure an email provider](/docs/self-hosting#configure-email-with-postmark) so magic code emails work.
- [Restrict dashboard signups](/docs/self-hosting#restrict-dashboard-signups) and [disable temporary apps](/docs/self-hosting#temporary-apps) to prevent unwanted app creation.
- Configure webhooks for your self-hosted app if your app uses them.

If your app uses OAuth for end-user sign-in, recreate each OAuth provider on
the restored app. Copy its client ID, client secret, and any other provider
settings. Then add the self-hosted callback URL to the provider:

```text
https://api.myinstant.com/runtime/oauth/callback
```

Keep the daabase Cloud callback configured until the migration is complete.

### Restore a test backup

Migrating without data loss will require some downtime. To get a sense of how
much time it will take, first [restore a backup from daabase Cloud](/docs/backups#restore-a-backup).

After restoring, verify that the following look correct:

- Schema and permissions
- Application data
- Files
- Magic code and each OAuth provider your app uses
- Email templates

### Prepare the client change

After successfully restoring the test backup, we can put up a PR to update our
clients to point to our new self-hosted daabase app.

Choose a new app ID for the self-hosted app. The ID must be a valid UUID. You
can generate one in the terminal with:

```sh {% showCopy=true %}
uuidgen
```

This will be your app ID going forward.

Create a PR that points your app at self-hosted daabase, but do not merge it
yet. Update the app ID, API URL, and WebSocket URL in every client `init` call:

```ts
const db = init({
  appId: 'YOUR_NEW_APP_ID',
  apiURI: 'https://api.myinstant.com',
  websocketURI: 'wss://api.myinstant.com/runtime/session',
});
```

If you use the Admin SDK, update its app ID, admin token, and `apiURI` too. Keep
the PR ready to merge as soon as the final restore finishes.

## Cut over

### Pause writes on daabase Cloud

Open the app's **Admin** page in the daabase Cloud dashboard. Turn on
**Read-only mode**, then wait 30 seconds for in-flight mutations to finish.

Reads, live queries, and presence will keep working. New writes will be
rejected, including offline writes queued on user devices. We do this to ensure
there is no data loss during the cutover.

### Restore the final backup

Create an on-demand backup of the daabase Cloud app and restore it into self-hosted
daabase using the app ID from the rehearsal.

Before merging our earlier PR to switch clients over:

- Check that `/health/system` returns `{"wal":"ok"}`.
- Check the restored schema, permissions, data, and files.
- Make sure **Read-only mode** is off on the self-hosted app.
- Test magic code and OAuth login if your app uses them.

### Switch to self-hosted daabase

Merge and deploy the PR you prepared earlier. New client connections will now
use the restored app on self-hosted daabase. Users may need to sign in again.

Watch the deployment and verify queries, writes, authentication, and file
uploads. Once clients begin writing to self-hosted daabase, the daabase Cloud
copy is no longer current. If you use OAuth, you can remove the daabase Cloud
callback URL from each OAuth provider.

The migration should now be complete. Huzzah! 🎉
