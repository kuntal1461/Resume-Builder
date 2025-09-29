CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- User-specific fields
  username      VARCHAR(255) NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(255) NOT NULL,
  last_name     VARCHAR(255) NOT NULL,
  phone_number  VARCHAR(32)  NULL UNIQUE,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  signInBy      VARCHAR(64)  NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,       -- 1 = active, other values = inactive/archived
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        VARCHAR(100) NULL,
  lastUpdatedBy   VARCHAR(100) NULL,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Audit timestamps (if you still want them separate from loggedInTime/lastUpdateTime)
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
