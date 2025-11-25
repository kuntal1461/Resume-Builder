SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

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
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resume_template_version_template
    FOREIGN KEY (template_id) REFERENCES resume_template (id),
  CONSTRAINT uq_resume_template_version UNIQUE (template_id, version_no)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;



DROP TABLE IF EXISTS user_resume_version;
DROP TABLE IF EXISTS user_resume;

CREATE TABLE IF NOT EXISTS user_resume (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id                     BIGINT UNSIGNED NOT NULL,
  template_id                 BIGINT UNSIGNED NOT NULL,
  user_template_version_no    BIGINT UNSIGNED NULL,
  title                       VARCHAR(200) NOT NULL,
  current_template_version_id BIGINT UNSIGNED NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_resume_user
    FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT fk_user_resume_template
    FOREIGN KEY (template_id) REFERENCES resume_template (id),
  CONSTRAINT fk_user_resume_template_version
    FOREIGN KEY (current_template_version_id) REFERENCES resume_template_version (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_resume_version (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_resume_id        BIGINT UNSIGNED NOT NULL,
  latex_source_snapshot LONGTEXT NULL,
  structured_data_json  JSON NULL,
  render_artifacts_json JSON NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_resume_version_parent
    FOREIGN KEY (user_resume_id) REFERENCES user_resume (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS job_source;
CREATE TABLE IF NOT EXISTS job_source (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  source_name BIGINT UNSIGNED NOT NULL,
  source_url TEXT NULL,
  enabled_for_scrapping BOOLEAN NOT NULL DEFAULT TRUE,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
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

DROP TABLE IF EXISTS job_raw_scrape;
CREATE TABLE IF NOT EXISTS job_raw_scrape (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  source_id     BIGINT UNSIGNED NOT NULL,
  job_url       TEXT NOT NULL,
  raw_content   LONGTEXT NULL,
  status        BIGINT UNSIGNED NULL,
  error_message TEXT NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_raw_scrape_source
    FOREIGN KEY (source_id) REFERENCES job_source (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS company_master;
CREATE TABLE IF NOT EXISTS company_master (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NULL,
  logo_url TEXT NULL,
  website_url TEXT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
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

DROP TABLE IF EXISTS job_master;
CREATE TABLE IF NOT EXISTS job_master (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  external_job_id      VARCHAR(255) NULL,
  job_url              TEXT NOT NULL,
  source_id            BIGINT UNSIGNED NOT NULL,
  title                VARCHAR(255) NOT NULL,
  company_id           BIGINT UNSIGNED NULL,
  location             VARCHAR(255) NULL,
  employment_type      BIGINT UNSIGNED NULL,
  experience_required  VARCHAR(255) NULL,
  salary_min           DECIMAL(15, 2) NULL,
  salary_max           DECIMAL(15, 2) NULL,
  job_description      LONGTEXT NULL,
  posted_date          DATETIME NULL,
  -- CommonEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_master_source
    FOREIGN KEY (source_id) REFERENCES job_source (id),
  CONSTRAINT fk_job_master_company
    FOREIGN KEY (company_id) REFERENCES company_master (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
