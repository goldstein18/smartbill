
-- Add is_billable column to time_entries table
ALTER TABLE public.time_entries 
ADD COLUMN is_billable BOOLEAN NOT NULL DEFAULT true;

-- Add index for better query performance on billable status
CREATE INDEX idx_time_entries_is_billable ON public.time_entries(is_billable);

-- Update the updated_at timestamp function to trigger on is_billable changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_time_entries_updated_at') THEN
    CREATE TRIGGER update_time_entries_updated_at 
    BEFORE UPDATE ON public.time_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
