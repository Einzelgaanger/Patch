
ALTER TABLE public.questionnaire_responses
  ADD COLUMN IF NOT EXISTS canteen_memories text,
  ADD COLUMN IF NOT EXISTS house_colours_description text,
  ADD COLUMN IF NOT EXISTS inter_house_competitions text,
  ADD COLUMN IF NOT EXISTS prefect_names_during_time text,
  ADD COLUMN IF NOT EXISTS timetable_description text,
  ADD COLUMN IF NOT EXISTS swimming_pool_memories text,
  ADD COLUMN IF NOT EXISTS chapel_memories text,
  ADD COLUMN IF NOT EXISTS entertainment_memories text,
  ADD COLUMN IF NOT EXISTS games_and_hobbies text,
  ADD COLUMN IF NOT EXISTS visiting_days_memories text,
  ADD COLUMN IF NOT EXISTS opening_closing_day text,
  ADD COLUMN IF NOT EXISTS notability text,
  ADD COLUMN IF NOT EXISTS signature_contribution text,
  ADD COLUMN IF NOT EXISTS school_connection text,
  ADD COLUMN IF NOT EXISTS legacy_note text;
