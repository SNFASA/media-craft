-- Enable Row Level Security on all tables
ALTER TABLE public.galleryitem ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mediafile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excomember ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excosection ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event table
CREATE POLICY "Everyone can view events" ON public.event
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert events" ON public.event
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update events" ON public.event
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete events" ON public.event
FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for newsarticle table
CREATE POLICY "Everyone can view published news" ON public.newsarticle
FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert news" ON public.newsarticle
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON public.newsarticle
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON public.newsarticle
FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for galleryitem table
CREATE POLICY "Everyone can view gallery items" ON public.galleryitem
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert gallery items" ON public.galleryitem
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery items" ON public.galleryitem
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery items" ON public.galleryitem
FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for mediafile table
CREATE POLICY "Authenticated users can view media files" ON public.mediafile
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert media files" ON public.mediafile
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media files" ON public.mediafile
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media files" ON public.mediafile
FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for excomember table
CREATE POLICY "Everyone can view exco members" ON public.excomember
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert exco members" ON public.excomember
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update exco members" ON public.excomember
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete exco members" ON public.excomember
FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for excosection table
CREATE POLICY "Everyone can view exco sections" ON public.excosection
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert exco sections" ON public.excosection
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update exco sections" ON public.excosection
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete exco sections" ON public.excosection
FOR DELETE USING (auth.role() = 'authenticated');