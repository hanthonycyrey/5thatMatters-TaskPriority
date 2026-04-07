/*
  # Add Duration and Progress Tracking to Tasks

  1. New Columns
    - `estimated_duration` (text) - Task duration estimate: '15min', '1hour', '1day', '1week', '1month'
    - `progress` (integer) - Task progress percentage: 0, 20, 40, 60, 80, 100
  
  2. Changes
    - Add estimated_duration column with default '1hour'
    - Add progress column with default 0
  
  3. Notes
    - Duration helps categorize tasks for smart grouping (quick wins vs deep work)
    - Progress is tracked internally via checkpoint system
    - Duration values: 15min, 1hour, 1day, 1week, 1month
    - Progress values: 0, 20, 40, 60, 80, 100
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'estimated_duration'
  ) THEN
    ALTER TABLE tasks ADD COLUMN estimated_duration text NOT NULL DEFAULT '1hour';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'progress'
  ) THEN
    ALTER TABLE tasks ADD COLUMN progress integer NOT NULL DEFAULT 0;
  END IF;
END $$;