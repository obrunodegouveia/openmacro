# Private modules

A private module is shown only to learners who have been granted it. Without a
grant it doesn't appear on the path, in the course map, on the dashboard or at
its lesson addresses. It is also left out of the sitemap, the public module
pages, rewards and assigned exams.

Private means hidden, not secret. The lessons are in this public repository and
in the app bundle, so nothing confidential belongs in one.

## Add a module

1. Write it under `packages/core/src/content/private/<module-id>/`, the same
   way as a public module.
2. Add it to `PRIVATE_MODULES` in `packages/core/src/content/private.ts`.
3. Run `npm run lint:content`, which checks private and public modules
   together.

## Grant one

Apply `supabase/migrations/0009_module_grants.sql` once. Then, in the Supabase
SQL editor, change the two values on the `where` line. Use the part before the
`@` with the dots removed:

```sql
insert into public.module_grants (user_id, module_id)
select id, 'bitcoin-price-formation'
from auth.users
where lower(replace(split_part(email, '@', 1), '.', '')) = 'learnername'
  and lower(split_part(email, '@', 2)) = 'gmail.com'
on conflict do nothing
returning user_id, module_id;
```

`INSERT 0 0` means no account uses that address. The learner must be signed in
on the device. The app checks again on its next start, and the website on its
next page load.

## Revoke one

```sql
delete from public.module_grants g
using auth.users u
where u.id = g.user_id
  and g.module_id = 'bitcoin-price-formation'
  and lower(replace(split_part(u.email, '@', 1), '.', '')) = 'learnername'
  and lower(split_part(u.email, '@', 2)) = 'gmail.com';
```

The app keeps the last list it read so the module still works offline. It
disappears there the next time the app reads the grants online.
