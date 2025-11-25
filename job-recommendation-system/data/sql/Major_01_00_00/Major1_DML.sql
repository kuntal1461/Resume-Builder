INSERT INTO users (
  username,
  email,
  password_hash,
  first_name,
  last_name,
  is_active,
  is_admin,
  signInBy
) VALUES (
  'AdminKK',
  'kkadmin@gmail.com',
  '$2b$12$NkCxk6uy2i9GyGwn0fLf/.bIzSU3gY1I9bW2YPPqndTDXO0uK8NLi',
  'Admin',
  'Maity',
  1,
  1,
  'SYSTEM'
) AS seed_admin
ON DUPLICATE KEY UPDATE
  password_hash = seed_admin.password_hash,
  first_name = seed_admin.first_name,
  last_name = seed_admin.last_name,
  is_active = seed_admin.is_active,
  is_admin = seed_admin.is_admin,
  signInBy = seed_admin.signInBy;
