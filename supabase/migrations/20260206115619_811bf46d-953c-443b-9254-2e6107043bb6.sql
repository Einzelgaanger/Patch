-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create questionnaire_responses table
CREATE TABLE public.questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Personal Information
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    current_location TEXT,
    
    -- School Information
    admission_year INTEGER NOT NULL,
    graduation_year INTEGER NOT NULL,
    admission_number TEXT,
    house TEXT NOT NULL,
    
    -- Leadership & Achievements
    was_prefect BOOLEAN DEFAULT FALSE,
    prefect_position TEXT,
    was_sports_captain BOOLEAN DEFAULT FALSE,
    sports_captain_details TEXT,
    was_club_leader BOOLEAN DEFAULT FALSE,
    club_leader_details TEXT,
    
    -- Sports Participation
    sports_participated TEXT[], -- Array of sports
    sports_achievements TEXT,
    
    -- Academic Information
    subjects_taken TEXT[],
    academic_achievements TEXT,
    
    -- Memories & Stories
    favorite_teachers TEXT,
    memorable_events TEXT,
    funny_stories TEXT,
    traditions_remembered TEXT,
    
    -- Career Information
    current_profession TEXT,
    career_achievements TEXT,
    
    -- Book Contribution
    willing_to_be_interviewed BOOLEAN DEFAULT FALSE,
    has_photos_to_share BOOLEAN DEFAULT FALSE,
    additional_comments TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on questionnaire_responses
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public form)
CREATE POLICY "Anyone can submit questionnaire"
ON public.questionnaire_responses
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can view all responses
CREATE POLICY "Admins can view all responses"
ON public.questionnaire_responses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update responses
CREATE POLICY "Admins can update responses"
ON public.questionnaire_responses
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete responses
CREATE POLICY "Admins can delete responses"
ON public.questionnaire_responses
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Users can only view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Only existing admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for questionnaire_responses
CREATE TRIGGER update_questionnaire_responses_updated_at
BEFORE UPDATE ON public.questionnaire_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();