-- Migration: Enable Row Level Security (RLS) on all required tables
-- DATA-01: Implementación de RLS y políticas de privacidad de datos
-- This migration ensures all tables have RLS enabled with proper policies

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================
-- Enable RLS on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to ensure clean state)
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;

-- Policy: Users can view their own clients
CREATE POLICY "Users can view their own clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can create their own clients
CREATE POLICY "Users can create their own clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own clients
CREATE POLICY "Users can update their own clients" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own clients
CREATE POLICY "Users can delete their own clients" 
  ON public.clients 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
-- Enable RLS on invoices table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to ensure clean state)
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can create their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;

-- Policy: Users can view their own invoices
CREATE POLICY "Users can view their own invoices" 
  ON public.invoices 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can create their own invoices
CREATE POLICY "Users can create their own invoices" 
  ON public.invoices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own invoices
CREATE POLICY "Users can update their own invoices" 
  ON public.invoices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own invoices
CREATE POLICY "Users can delete their own invoices" 
  ON public.invoices 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================================
-- CREDIT NOTES TABLE (Create if doesn't exist)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credit_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  credit_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'applied')),
  applied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on credit_notes
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own credit notes" ON public.credit_notes;
DROP POLICY IF EXISTS "Users can create their own credit notes" ON public.credit_notes;
DROP POLICY IF EXISTS "Users can update their own credit notes" ON public.credit_notes;
DROP POLICY IF EXISTS "Users can delete their own credit notes" ON public.credit_notes;

-- Create policies for credit_notes
CREATE POLICY "Users can view their own credit notes" 
  ON public.credit_notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credit notes" 
  ON public.credit_notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit notes" 
  ON public.credit_notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit notes" 
  ON public.credit_notes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_credit_notes_user_id ON public.credit_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_invoice_id ON public.credit_notes(invoice_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_credit_number_per_user ON public.credit_notes(user_id, credit_number);

-- ============================================================================
-- INVOICE TIMELINES TABLE (Create if doesn't exist)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoice_timelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'sent', 'viewed', 'paid', 'overdue', 'updated', 'cancelled')),
  event_description TEXT,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invoice_timelines
ALTER TABLE public.invoice_timelines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own invoice timelines" ON public.invoice_timelines;
DROP POLICY IF EXISTS "Users can create their own invoice timelines" ON public.invoice_timelines;
DROP POLICY IF EXISTS "Users can update their own invoice timelines" ON public.invoice_timelines;
DROP POLICY IF EXISTS "Users can delete their own invoice timelines" ON public.invoice_timelines;

-- Create policies for invoice_timelines
-- Users can only see timelines for invoices they own
CREATE POLICY "Users can view their own invoice timelines" 
  ON public.invoice_timelines 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_timelines.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own invoice timelines" 
  ON public.invoice_timelines 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_timelines.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own invoice timelines" 
  ON public.invoice_timelines 
  FOR UPDATE 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_timelines.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own invoice timelines" 
  ON public.invoice_timelines 
  FOR DELETE 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_timelines.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoice_timelines_user_id ON public.invoice_timelines(user_id);
CREATE INDEX IF NOT EXISTS idx_invoice_timelines_invoice_id ON public.invoice_timelines(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_timelines_event_type ON public.invoice_timelines(event_type);

-- ============================================================================
-- PROVIDERS TABLE (Create if doesn't exist)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT,
  contact_person TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on providers
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own providers" ON public.providers;
DROP POLICY IF EXISTS "Users can create their own providers" ON public.providers;
DROP POLICY IF EXISTS "Users can update their own providers" ON public.providers;
DROP POLICY IF EXISTS "Users can delete their own providers" ON public.providers;

-- Create policies for providers
CREATE POLICY "Users can view their own providers" 
  ON public.providers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own providers" 
  ON public.providers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own providers" 
  ON public.providers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own providers" 
  ON public.providers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON public.providers(user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================
-- All tables now have RLS enabled with policies that ensure:
-- 1. Users can only access their own data (auth.uid() = user_id)
-- 2. For related tables (invoice_timelines), access is controlled through
--    the parent table (invoices) ownership
-- 3. All policies use USING clause for SELECT/UPDATE/DELETE and
--    WITH CHECK clause for INSERT to ensure data integrity
