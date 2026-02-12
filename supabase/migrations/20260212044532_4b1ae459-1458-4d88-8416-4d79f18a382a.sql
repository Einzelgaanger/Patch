
-- Create storage bucket for questionnaire file uploads (photos, videos, PDFs)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('questionnaire-uploads', 'questionnaire-uploads', true, NULL);

-- Allow anyone to upload files to the questionnaire-uploads bucket
CREATE POLICY "Anyone can upload questionnaire files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'questionnaire-uploads');

-- Allow anyone to view uploaded files
CREATE POLICY "Anyone can view questionnaire files"
ON storage.objects FOR SELECT
USING (bucket_id = 'questionnaire-uploads');

-- Add a column to store uploaded file paths
ALTER TABLE public.questionnaire_responses
ADD COLUMN uploaded_files text[] DEFAULT NULL;
