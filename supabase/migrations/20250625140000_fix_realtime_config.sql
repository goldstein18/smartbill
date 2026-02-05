
-- Ensure all tables have proper replica identity for real-time updates
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;
ALTER TABLE public.invoice_items REPLICA IDENTITY FULL;

-- Add all tables to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoice_items;
