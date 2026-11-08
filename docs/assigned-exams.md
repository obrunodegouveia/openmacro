# Assigning an exam to a student

A teacher can assign an exam to one signed-in learner. It appears on their
Today screen in the app and on their dashboard on the website. There is no admin
screen yet, so assigning and reading results happen in the Supabase SQL editor.

Keep names and email addresses out of this repository, which is public. They
belong only in the query you run.

## Before you start

1. Apply `supabase/migrations/0008_assigned_exams.sql` and
   `0010_exam_timer.sql` to the project.
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
select e.assigned_at, e.started_at, e.submitted_at, e.correct, e.asked,
       e.duration_seconds, e.leaves, e.bonus_xp, e.by_level, e.weak_modules,
       e.missed_items
from public.assigned_exams e
join auth.users u on u.id = e.user_id
where lower(replace(split_part(u.email, '@', 1), '.', '')) = 'studentname'
  and lower(split_part(u.email, '@', 2)) = 'gmail.com'
order by e.assigned_at desc;
```

`weak_modules` lists the modules where the student got nothing right.
`duration_seconds` is the time from the first tap on Start to handing in, by
the database's clock. It is empty for an exam handed in before migration 0010,
or one started while the database could not be reached.
`leaves` is how many times the student left the exam before handing it in.

## A retake on what they got wrong

Every exam handed in after migration 0010 records `paper_items` (every
question asked) and `missed_items` (the ones answered wrong). These are ids
like `lesson-id#challenge-id`, and never the answers themselves. A retake uses
four columns:

- `focus_lessons`: draw only from these lessons.
- `exclude_items`: never ask these questions, so every question is new.
- `review_items`: shown before Start as "last time you got these wrong".
- `review_lessons`: more lessons to go back to.

The screen before Start lists the questions from `review_items`. It then lists
the lessons of those questions and of `review_lessons`, each one ticked once
the student has finished it again since the retake was assigned. A lesson
built around a video says so. This is advice only, and Start is never locked.

This sets a retake from the student's latest exam:

```sql
with last as (
  select e.user_id, e.locale, e.paper_items, e.missed_items
  from public.assigned_exams e
  join auth.users u on u.id = e.user_id
  where lower(replace(split_part(u.email, '@', 1), '.', '')) = 'studentname'
    and lower(split_part(u.email, '@', 2)) = 'gmail.com'
    and e.submitted_at is not null
  order by e.submitted_at desc
  limit 1
)
insert into public.assigned_exams
  (user_id, locale, item_count, focus_lessons, exclude_items, review_items)
select user_id, locale, 20,
       (select array_agg(distinct split_part(item, '#', 1)) from unnest(missed_items) item),
       paper_items,
       missed_items
from last
returning id;
```

Exams handed in before 0010 have no `paper_items`. Their paper can still be
rebuilt offline from the seed and the lessons the student had finished, and
checked against `fingerprint`, because the fingerprint is a hash of the seed
and the exact questions.

## The clock and the speed bonus

- The clock starts the first time the student taps Start and keeps running if
  they leave. Starting again does not reset it.
- Below 70% correct there is no bonus, however fast.
- Leaving the exam even once costs the whole bonus. Leaving means the app
  going to the background, the browser tab being hidden (another tab, another
  app, a minimised window), or closing the exam and starting it again. The
  student is told straight away, and the count is in `leaves`. While the exam
  runs the screen is kept awake, so the phone locking itself does not count.
  Pulling down the notification shade or Control Centre does not count either.
  A second window placed beside the browser is not detected.
- At 70% or more: 30 seconds a question or less earns 5 XP per question; 60
  seconds a question or less earns half of that; slower earns nothing. A
  20-question exam is worth up to 100 XP.
- The database works the bonus out when the exam is handed in
  (`submit_assigned_exam`), and it is minted to euros like lesson XP for a
  student on the earnings scheme (`web/src/lib/rewards/earnings.ts`).
- The rule is copied in `EXAM_SPEED_BONUS` in
  `packages/core/src/engine/assignedExam.ts` for the screens, and a test fails
  if the two disagree.

## Holding earnings until a final exam

Migration 0011. A student on the earnings scheme can have their withdrawals
held until they pass a final exam. The balance keeps growing the whole time;
only the Withdraw button waits.

1. In the treasury dashboard, on the student's recipient, choose
   **Hold until final exam**. Or in SQL:

   ```sql
   update public.reward_recipients
      set locked_until_final_exam = true, updated_at = now()
    where key = '<recipient key>';
   ```

2. Assign the final exam as usual, with `is_final = true` (or set it on an
   exam already assigned and not yet handed in):

   ```sql
   update public.assigned_exams set is_final = true where id = '<exam id>';
   ```

The exam's intro tells the student it is final and what passing releases,
and the result screen says whether they passed. Passing is 70% or more right
(`examPassed` in `packages/core/src/engine/assignedExam.ts`). The lock lifts by
itself on the next read of the balance; nobody has to unlock it. A failed final
exam is one attempt, so the student stays locked until you assign another one.

`/api/earnings` refuses a locked withdrawal before it opens a claim. The
score is graded on the student's device, so the fingerprint is how to check a
pass you doubt (see the retake section).

## How it behaves

- Questions come only from lessons the student has finished, in proportion to
  what they have finished at each level.
- There are no hearts and no feedback until the end.
- Leaving before the end saves nothing, and the exam stays available. Unless
  they finish more lessons first, they get the same paper again.
- The first result handed in stands. To test again, assign a new exam.
- Scores are saved, and answers are not.
- Grading runs on the student's device, so this is a progress check rather than
  a credential: a determined student could send a false score, and with it
  claim a speed bonus. The time cannot be faked, and the bonus is at most 5 XP
  per question the teacher set, once per exam.
- Deleting the account deletes the exam and its result.
