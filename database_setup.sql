-- Database Setup for Arielle Pivonka Art Website
-- Run this in your SiteWorks phpMyAdmin or MySQL interface

-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS arielle_art_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE arielle_art_db;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    medium VARCHAR(50) NOT NULL,
    size VARCHAR(100),
    description TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_medium (medium),
    INDEX idx_created_at (created_at)
);

-- Create artwork table (for future portfolio management)
CREATE TABLE IF NOT EXISTS artwork (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    medium VARCHAR(50) NOT NULL,
    dimensions VARCHAR(100),
    year_created YEAR,
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    category VARCHAR(50),
    featured BOOLEAN DEFAULT FALSE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_available (available),
    INDEX idx_year (year_created)
);

-- Create newsletter subscribers table (for future email marketing)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    source VARCHAR(50) DEFAULT 'website',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Create site settings table (for future admin panel)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_title', 'Arielle Pivonka - Artist Portfolio', 'Main site title'),
('artist_name', 'Arielle Pivonka', 'Artist full name'),
('artist_email', 'arielle@yourdomain.com', 'Primary contact email'),
('artist_phone', '', 'Contact phone number'),
('artist_location', '', 'Artist location'),
('social_instagram', '', 'Instagram profile URL'),
('social_facebook', '', 'Facebook profile URL'),
('social_twitter', '', 'Twitter profile URL'),
('commission_enabled', '1', 'Whether commission requests are enabled'),
('contact_enabled', '1', 'Whether contact form is enabled'),
('maintenance_mode', '0', 'Whether site is in maintenance mode')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Create admin users table (for future admin panel)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'editor') DEFAULT 'editor',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create activity log table (for tracking admin actions)
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create file uploads table (for managing uploaded images)
CREATE TABLE IF NOT EXISTS file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_type ENUM('artwork', 'profile', 'gallery', 'other') DEFAULT 'other',
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_upload_type (upload_type),
    INDEX idx_uploaded_by (uploaded_by),
    FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create sample artwork data (optional - remove if you want to start fresh)
INSERT INTO artwork (title, description, medium, dimensions, year_created, category, featured, available) VALUES
('Emotional Landscape', 'An exploration of inner emotions through abstract forms and vibrant colors', 'Acrylic on Canvas', '24x36 inches', 2024, 'paintings', TRUE, TRUE),
('Color Symphony', 'A harmonious blend of colors creating visual music', 'Acrylic on Canvas', '30x40 inches', 2024, 'paintings', TRUE, TRUE),
('Urban Reflections', 'Charcoal study of city life and human connection', 'Charcoal on Paper', '18x24 inches', 2024, 'drawings', FALSE, TRUE),
('Textured Memories', 'Mixed media exploration of personal history', 'Mixed Media', '20x20 inches', 2024, 'mixed-media', FALSE, TRUE),
('Inner Light', 'Abstract representation of spiritual awakening', 'Acrylic on Canvas', '36x48 inches', 2024, 'paintings', TRUE, FALSE),
('Fluid Motion', 'Ink study capturing the essence of movement', 'Ink on Paper', '12x16 inches', 2024, 'drawings', FALSE, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_contacts_email_status ON contacts(email, status);
CREATE INDEX idx_commissions_status_created ON commissions(status, created_at);
CREATE INDEX idx_artwork_category_featured ON artwork(category, featured);

-- Grant permissions (adjust username as needed for your SiteWorks setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON arielle_art_db.* TO 'your_db_username'@'localhost';

-- Show tables to verify creation
SHOW TABLES;

-- Show table structures
DESCRIBE contacts;
DESCRIBE commissions;
DESCRIBE artwork;
