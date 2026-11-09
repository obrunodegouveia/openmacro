-- ============================================================================
-- OpenMacro — a time limit on each question of an assigned exam, and a note
-- from the teacher shown before Start
-- ============================================================================
--
-- `seconds_per_question`: when set, every question of the paper gets this
-- many seconds. When they run out, the client moves on by itself and the
-- question counts as answered with whatever the learner had chosen, or as
-- unanswered (wrong) if nothing was chosen. Null keeps the exam untimed per
-- question, as before; the whole-exam clock and the speed bonus (0010) apply
-- either way.
--
-- The limit is kept on the learner's device, like the grading (0008). The
-- whole-exam time is still the server's, so a paper handed in much slower
-- than `asked × seconds_per_question` shows up in `duration_seconds`.
--
-- `study_note`: a few lines from the teacher, in the exam's language, shown
-- at the top of the study plan before a retake: what to study above all.
--
-- Both are read by the clients through ASSIGNED_EXAM_COLUMNS
-- (packages/core/src/engine/assignedExam.ts), so this migration must be
-- applied before a client that selects them ships.

alter table public.assigned_exams
  add column if not exists seconds_per_question integer
    check (seconds_per_question between 10 and 600),
  add column if not exists study_note text
    check (char_length(study_note) <= 1000);

comment on column public.assigned_exams.seconds_per_question is
  'Time limit for each question, in seconds. Null: no limit per question.';
comment on column public.assigned_exams.study_note is
  'The teacher''s advice, shown before Start, in the exam''s language.';
