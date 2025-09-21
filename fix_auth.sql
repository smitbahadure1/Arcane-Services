-- Fix authentication settings and create admin user

-- 1. Update auth configuration to disable email confirmation
UPDATE auth.config 
SET raw_user_meta_data = '{}',
    raw_app_meta_data = '{}',
    is_super_admin = false,
    created_at = now(),
    updated_at = now()
WHERE id = 1;

-- 2. Create admin user directly
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'bahaduresmit08@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  null,
  '',
  '',
  null,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null
) ON CONFLICT (email) DO NOTHING;

-- 3. Alternative simpler approach - just disable email confirmation via SQL
-- This might work better:
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'bahaduresmit08@gmail.com';
