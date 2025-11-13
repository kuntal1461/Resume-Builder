DROP TABLE IF EXISTS resume_template_parent_category_master;

CREATE TABLE IF NOT EXISTS resume_template_parent_category_master (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  parent_id  BIGINT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        VARCHAR(100) NULL,
  lastUpdatedBy   VARCHAR(100) NULL,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Audit timestamps
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS resume_template_sub_category_master;

CREATE TABLE IF NOT EXISTS resume_template_sub_category_master (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  parent_id  BIGINT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        VARCHAR(100) NULL,
  lastUpdatedBy   VARCHAR(100) NULL,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Audit timestamps
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resume_template_sub_category_parent
    FOREIGN KEY (parent_id) REFERENCES resume_template_parent_category_master (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS resume_template;

CREATE TABLE IF NOT EXISTS resume_template (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  headline          VARCHAR(255) NULL,
  category_id       BIGINT UNSIGNED NULL,
  owner_admin_id    BIGINT UNSIGNED NOT NULL DEFAULT 0,
  status            BIGINT NOT NULL DEFAULT 0,
  preview_pdf_url   TEXT NULL,
  preview_image_url TEXT NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        VARCHAR(100) NULL,
  lastUpdatedBy   VARCHAR(100) NULL,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Audit timestamps
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resume_template_category
    FOREIGN KEY (category_id) REFERENCES resume_template_sub_category_master (id),
  CONSTRAINT fk_resume_template_owner_admin
    FOREIGN KEY (owner_admin_id) REFERENCES users (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS resume_template_version;

CREATE TABLE IF NOT EXISTS resume_template_version (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  template_id BIGINT UNSIGNED NOT NULL,
  version_no BIGINT NOT NULL DEFAULT 1,
  latex_source TEXT NOT NULL,
  assets_manifest_json JSON NULL,
  changelog TEXT NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        VARCHAR(100) NULL,
  lastUpdatedBy   VARCHAR(100) NULL,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Audit timestamps
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resume_template_version_template
    FOREIGN KEY (template_id) REFERENCES resume_template (id),
  CONSTRAINT uq_resume_template_version UNIQUE (template_id, version_no)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
