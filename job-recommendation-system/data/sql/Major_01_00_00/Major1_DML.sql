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
  '$2b$12$6pZoHfE8C8qDnEX3A8V1zu6i0GUrHHQ9iVtqPtC1KpUkgHMsxie3i',
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
