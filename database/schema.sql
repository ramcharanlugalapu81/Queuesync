CREATE DATABASE IF NOT EXISTS campus_queue_manager
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_queue_manager;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  location VARCHAR(120) NOT NULL,
  prefix VARCHAR(6) NOT NULL UNIQUE,
  icon VARCHAR(50) NOT NULL DEFAULT 'apartment',
  average_service_minutes INT NOT NULL DEFAULT 4,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  campus_id VARCHAR(60) NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'provider') NOT NULL DEFAULT 'student',
  service_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS queue_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  service_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  ticket_code VARCHAR(30) NOT NULL UNIQUE,
  student_name VARCHAR(120) NOT NULL,
  campus_id VARCHAR(60) NULL,
  phone VARCHAR(30) NULL,
  access_key_hash CHAR(64) NULL,
  status ENUM('waiting', 'called', 'completed', 'cancelled') NOT NULL DEFAULT 'waiting',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  called_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  CONSTRAINT fk_token_service FOREIGN KEY (service_id) REFERENCES services(id),
  CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_queue_order (service_id, status, joined_at),
  INDEX idx_user_active (user_id, status)
);

INSERT IGNORE INTO services
  (name, category, description, location, prefix, icon, average_service_minutes, sort_order)
VALUES
  ('Academic Certificates', 'Registrar office', 'Request transcripts, enrollment letters, and degree certificates.', 'Central Registrar · Window 04', 'A', 'school', 4, 1),
  ('Hardware & Maker Lab', 'Engineering bay', 'Reserve lab equipment and get help with workshop access.', 'Innovation Hub · Desk 2', 'M', 'precision_manufacturing', 3, 2),
  ('Financial Aid & Bursar', 'Bursar division', 'Questions about tuition payments, aid, and scholarships.', 'Student Centre · Floor 1', 'F', 'account_balance', 7, 3),
  ('Campus Health Clinic', 'Wellness pavilion', 'Check in for student health and wellness appointments.', 'Wellness Pavilion · Reception', 'H', 'medical_services', 5, 4);

-- For a real deployment, create provider accounts through a trusted admin
-- workflow and set role='provider'. Public registration creates student users.
