SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS job_raw_scrape;
DROP TABLE IF EXISTS job_source;
DROP TABLE IF EXISTS job_master;
DROP TABLE IF EXISTS company_master;

CREATE TABLE IF NOT EXISTS company_master (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NULL,
  logo_url TEXT NULL,
  website_url TEXT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  -- BaseEntity fields
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

CREATE TABLE IF NOT EXISTS job_source (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  source_name VARCHAR(255) NOT NULL,
  source_url TEXT NULL,
  enabled_for_scrapping BOOLEAN NOT NULL DEFAULT TRUE,
  scrape_type BIGINT NULL,
  api_endpoint VARCHAR(500) NULL,
  api_key VARCHAR(500) NULL,
  rate_limit_per_min VARCHAR(50) NULL,
  scraping_schedule BIGINT NULL,
  company_id BIGINT NULL,
  -- BaseEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_source_company
    FOREIGN KEY (company_id) REFERENCES company_master (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_master (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  external_job_id      VARCHAR(255) NULL,
  job_url              TEXT NOT NULL,
  source_id            BIGINT UNSIGNED NOT NULL,
  title                VARCHAR(255) NOT NULL,
  company_id           BIGINT NULL,
  location             VARCHAR(255) NULL,
  employment_type      BIGINT UNSIGNED NULL,
  experience_required  VARCHAR(255) NULL,
  salary_min           DECIMAL(15, 2) NULL,
  salary_max           DECIMAL(15, 2) NULL,
  job_description      LONGTEXT NULL,
  posted_date          DATETIME NULL,
  -- BaseEntity fields
  rowstate        INT NOT NULL DEFAULT 1,
  field1          VARCHAR(200) NULL,
  field2          VARCHAR(200) NULL,
  field3          BIGINT NULL,
  field4          BIGINT NULL,
  loggedBy        BIGINT NOT NULL DEFAULT 0,
  lastUpdatedBy   BIGINT NOT NULL DEFAULT 0,
  loggedInTime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdateTime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_master_company
    FOREIGN KEY (company_id) REFERENCES company_master (id)
) ENGINE=InnoDB
  AUTO_INCREMENT=1000
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_raw_scrape (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  source_id     BIGINT UNSIGNED NOT NULL,
  job_url       TEXT NOT NULL,
  raw_content   LONGTEXT NULL,
  status        BIGINT UNSIGNED NULL,
  error_message TEXT NULL,
  -- BaseEntity fields
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

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
