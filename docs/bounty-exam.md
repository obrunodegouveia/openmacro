# The bounty exam

A one-off challenge announced on 11 November 2026: the first person who
creates an account from that day on, finishes **lessons 1 to 13 of Banking and
Money** and reaches **2,100 XP**, then passes a 21-question exam with **15 or
more right**, wins **21,000 sats** (10 sats per XP of the threshold). The
public rules are at [openmacro.org/bounty](https://openmacro.org/bounty)
(`web/src/app/bounty`). The prize is paid by hand, from the organiser's own
wallet. The app never holds a key or sends bitcoin.

Migration `0014_bounty_exam.sql` does the rest:

- Every time a lesson result is saved, a trigger checks the learner. If they
  joined on or after 11 November 2026 (midnight, San Salvador time), they have
  finished all 13 lessons, their lesson XP adds up to 2,100 or more, and they
  have never had a bounty exam, it assigns them one: 21 questions drawn from
  those 13 lessons, 60 seconds each, in Spanish.
- The exam appears in the app and on the website the next time they open the
  home screen. No release is needed.
- One attempt per person.
- Once someone passes, no new bounty exams are handed out.

## Who has won

```sql
select e.user_id, u.created_at as joined, e.submitted_at,
       e.correct || '/' || e.asked as score, e.duration_seconds, e.leaves,
       (select coalesce(sum(best_xp), 0) from public.lesson_progress p
         where p.user_id = e.user_id) as lesson_xp
from public.assigned_exams e
join auth.users u on u.id = e.user_id
where e.bounty and e.submitted_at is not null
order by (e.asked > 0 and e.correct >= ceil(e.asked * 0.7)) desc, e.submitted_at
limit 10;
```

The first row with a passing score is the winner. Before paying, check it.

## Where to pay, and marking it paid

The winner leaves a Bitcoin address on /bounty. The site checks its checksum
and the database checks its shape (`submit_bounty_address`). Only someone who
passed can leave one.

```sql
select user_id, btc_address, submitted_at, paid_at, txid from public.bounty_payouts;
```

Paste the address into your wallet, which checks it again, and send. Then:

```sql
update public.bounty_payouts set paid_at = now(), txid = '<txid>' where user_id = '<winner user_id>';
```

The winner then sees "Paid" and the transaction on /bounty.

## Check the winner before paying

Lesson XP and the exam score are written by the learner's own device, so they
can be faked. Look at how the lessons were spread over time. A real learner
finishes them over hours or days, a few minutes apart. Forty lessons finished
in the same second is not a real learner.

```sql
select lesson_id, best_xp, completions, last_completed_at
from public.lesson_progress
where user_id = '<winner user_id>'
order by last_completed_at;
```

Also look at `duration_seconds` and `leaves` from the query above. Twenty
questions answered in a few seconds is not a real attempt either. If in doubt,
ask the winner to answer a few questions on a video call.

## Who is close

```sql
select p.user_id, u.created_at as joined, sum(p.best_xp) as lesson_xp,
       count(*) filter (where p.best_xp > 0) as lessons,
       max(p.last_completed_at) as last_lesson,
       exists (select 1 from public.assigned_exams e
                where e.user_id = p.user_id and e.bounty) as has_exam
from public.lesson_progress p
join auth.users u on u.id = p.user_id
where u.created_at >= timestamptz '2026-11-11 00:00:00-06'
group by p.user_id, u.created_at
order by lesson_xp desc
limit 20;
```

## Ending it

To stop handing out exams before anyone wins, drop the trigger:

```sql
drop trigger if exists lesson_progress_grant_bounty_exam on public.lesson_progress;
```
