SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- User-specific fields (PII hashed/encrypted at the service layer where noted)
  username      VARCHAR(255) NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE COMMENT 'Hashed before persistence',
  password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt hash of user password',
  first_name    VARCHAR(255) NOT NULL COMMENT 'Hashed before persistence',
  last_name     VARCHAR(255) NOT NULL COMMENT 'Hashed before persistence',
  phone_number  VARCHAR(32)  NULL UNIQUE COMMENT 'Hashed before persistence',
  dob           TIMESTAMP NULL COMMENT 'Hashed before persistence',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  is_admin      TINYINT(1)   NOT NULL DEFAULT 0,
  signInBy      VARCHAR(64)  NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,       -- 1 = active, other values = inactive/archived
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
