ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS oauth boolean;

ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS github_id bigint;

ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS google_id varchar(255);

ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS provider varchar(20);

UPDATE public.usuarios
SET oauth = false
WHERE oauth IS NULL;

UPDATE public.usuarios
SET provider = CASE
    WHEN google_id IS NOT NULL THEN 'GOOGLE'
    WHEN github_id IS NOT NULL THEN 'GITHUB'
    ELSE 'LOCAL'
END
WHERE provider IS NULL;

ALTER TABLE public.usuarios
ALTER COLUMN oauth SET DEFAULT false;

ALTER TABLE public.usuarios
ALTER COLUMN provider SET DEFAULT 'LOCAL';

ALTER TABLE public.usuarios
ALTER COLUMN oauth SET NOT NULL;

ALTER TABLE public.usuarios
ALTER COLUMN provider SET NOT NULL;

-- independencia de email e senha
ALTER TABLE public.usuarios
ALTER COLUMN email DROP NOT NULL;

ALTER TABLE public.usuarios
ALTER COLUMN senha DROP NOT NULL;
