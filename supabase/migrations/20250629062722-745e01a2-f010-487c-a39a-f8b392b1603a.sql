
-- Fix the security issues by setting proper search paths for functions
-- This prevents potential security vulnerabilities from search_path manipulation

-- Update get_user_role function to have a secure search path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = user_uuid ORDER BY 
     CASE role 
       WHEN 'super_admin' THEN 1 
       WHEN 'admin' THEN 2 
       WHEN 'user' THEN 3 
     END LIMIT 1),
    'user'::app_role
  );
$$;

-- Update has_role_or_higher function to have a secure search path
CREATE OR REPLACE FUNCTION public.has_role_or_higher(user_uuid UUID, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN required_role = 'user' THEN true
    WHEN required_role = 'admin' THEN public.get_user_role(user_uuid) IN ('admin', 'super_admin')
    WHEN required_role = 'super_admin' THEN public.get_user_role(user_uuid) = 'super_admin'
    ELSE false
  END;
$$;

-- Update handle_new_user function to have a secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function to have a secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
