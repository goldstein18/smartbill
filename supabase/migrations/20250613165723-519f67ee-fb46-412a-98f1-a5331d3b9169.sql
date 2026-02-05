
-- Enable replica identity for time_entries table to capture complete row data during updates
ALTER TABLE public.time_entries REPLICA IDENTITY FULL;

-- Add the time_entries table to the supabase_realtime publication to activate real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;
