
-- Create user_branding_profiles table for white-label customization
CREATE TABLE public.user_branding_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_tagline TEXT,
  company_email TEXT,
  company_phone TEXT,
  company_address TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_branding_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_branding_profiles
CREATE POLICY "Users can view their own branding profile" 
  ON public.user_branding_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own branding profile" 
  ON public.user_branding_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branding profile" 
  ON public.user_branding_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branding profile" 
  ON public.user_branding_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);
