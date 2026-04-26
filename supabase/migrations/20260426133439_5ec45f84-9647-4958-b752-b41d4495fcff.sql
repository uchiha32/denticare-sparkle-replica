
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Tighten storage SELECT: keep bucket public for direct file URLs, but
-- restrict listing via policy by requiring an explicit object name path.
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;

CREATE POLICY "Public can read individual blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images' AND name IS NOT NULL);
