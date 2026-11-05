# Assigning an exam to a student

A teacher can assign an exam to one signed-in learner. It appears on their
Today screen in the app and on their dashboard on the website. There is no admin
screen yet, so assigning and reading results happen in the Supabase SQL editor.

Keep names and email addresses out of this repository, which is public. They
belong only in the query you run.

## Before you start

1. Apply `supabase/migrations/0008_assigned_exams.sql` to the project.
2. Ship the app and the website that contain the exam screen.
3. Make sure the student has signed in on their device. Progress made while
   signed out stays on that device, and an exam cannot reach it.

## Assign an exam

This matches Gmail addresses with or without dots, because Gmail treats them as
the same address. Change the two values on the `where` line, and use the part
before the `@` with the dots removed.

```sql
insert into public.assigned_exams (user_id, locale, item_count)
select id, 'pt-PT', 20
from auth.users
where lower(replace(split_part(email, '@', 1), '.', '')) = 'studentname'
  and lower(split_part(email, '@', 2)) = 'gmail.com'
returning id, user_id, assigned_at;
```

`INSERT 0 0` means no account uses that address. Someone who signed in with
Apple and hid their address has a relay address here instead, so look them up in
**Authentication → Users**.

`locale` is the language of the whole exam, whatever the app is set to.
`item_count` is the most questions it will ask, and the exam is shorter if the
student has not finished enough lessons to fill it.

## Read the result

```sql
select e.assigned_at, e.submitted_at, e.correct, e.asked, e.by_level, e.weak_modules
from public.assigned_exams e
join auth.users u on u.id = e.user_id
where lower(replace(split_part(u.email, '@', 1), '.', '')) = 'studentname'
  and lower(split_part(u.email, '@', 2)) = 'gmail.com'
order by e.assigned_at desc;
```

`weak_modules` lists the modules where the student got nothing right.

## How it behaves

- Questions come only from lessons the student has finished, in proportion to
  what they have finished at each level.
- There are no hearts and no feedback until the end.
- Leaving before the end saves nothing, and the exam stays available. Unless
  they finish more lessons first, they get the same paper again.
- The first result handed in stands. To test again, assign a new exam.
- Scores are saved, and answers are not.
- Grading runs on the student's device, so this is a progress check rather than
  a credential: a determined student could send a false score.
- Deleting the account deletes the exam and its result.
