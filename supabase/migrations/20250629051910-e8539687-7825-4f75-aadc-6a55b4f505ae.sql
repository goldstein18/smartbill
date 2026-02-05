
-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');

-- Create user_roles table to manage roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create partner_applications table to store partnership applications
CREATE TABLE public.partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    experience TEXT,
    network TEXT,
    motivation TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create free_users table to track users with free access
CREATE TABLE public.free_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
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

-- Create function to check if user has specific role or higher
CREATE OR REPLACE FUNCTION public.has_role_or_higher(user_uuid UUID, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN required_role = 'user' THEN true
    WHEN required_role = 'admin' THEN public.get_user_role(user_uuid) IN ('admin', 'super_admin')
    WHEN required_role = 'super_admin' THEN public.get_user_role(user_uuid) = 'super_admin'
    ELSE false
  END;
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role_or_higher(auth.uid(), 'super_admin'));

-- RLS Policies for partner_applications
CREATE POLICY "Super admins can view all partner applications" ON public.partner_applications
  FOR SELECT USING (public.has_role_or_higher(auth.uid(), 'super_admin'));

CREATE POLICY "Anyone can create partner applications" ON public.partner_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admins can update partner applications" ON public.partner_applications
  FOR UPDATE USING (public.has_role_or_higher(auth.uid(), 'super_admin'));

-- RLS Policies for free_users
CREATE POLICY "Super admins can manage free users" ON public.free_users
  FOR ALL USING (public.has_role_or_higher(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view if they are free users" ON public.free_users
  FOR SELECT USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_applications_updated_at BEFORE UPDATE ON public.partner_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_free_users_updated_at BEFORE UPDATE ON public.free_users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
