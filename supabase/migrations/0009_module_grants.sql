-- ============================================================================
-- OpenMacro — modules shown only to the learners they are granted to
-- ============================================================================
--
-- A row here makes one private module (`packages/core/src/content/private.ts`)
-- appear in one learner's app and on their dashboard. Without a row the module
-- does not exist for them: it is not on the path, in the course map, or at its
-- lesson addresses. See docs/private-modules.md.
--
-- Grants are inserted from the SQL editor, so the learner is chosen here and
-- never named in the public repository.
--
-- This decides what is shown, not what is secret: the lesson text ships in the
-- public repository and in the app bundle.

create table if not exists public.module_grants (
  user_id     uuid not null references auth.users (id) on delete cascade,
  module_id   text not null check (module_id ~ '^[a-z0-9-]+$'),
  granted_at  timestamptz not null default now(),
  primary key (user_id, module_id)
);

comment on table public.module_grants is
  'Private modules a learner may see. Inserted from the SQL editor; a learner can only read their own rows.';

alter table public.module_grants enable row level security;

-- Read only. With no insert, update or delete policy a learner cannot grant
-- themselves a module.
drop policy if exists "module grants are readable by their owner" on public.module_grants;
create policy "module grants are readable by their owner"
  on public.module_grants
  for select
  using (auth.uid() = user_id);

grant select on public.module_grants to authenticated;
