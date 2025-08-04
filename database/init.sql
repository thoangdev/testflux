-- TestFlux Database Schema
-- PostgreSQL initialization script

-- Create database if it doesn't exist (handled by Docker)
-- CREATE DATABASE IF NOT EXISTS testflux;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Environments table
CREATE TABLE environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, name)
);

-- Test types table
CREATE TABLE test_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test runs table (main results metadata)
CREATE TABLE test_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    environment_id UUID NOT NULL REFERENCES environments(id),
    test_type_id UUID NOT NULL REFERENCES test_types(id),
    run_name VARCHAR(255),
    run_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(50) NOT NULL CHECK (source IN ('api', 'manual', 'github_actions')),
    source_metadata JSONB,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_files INTEGER DEFAULT 0,
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT
);

-- Robot Framework results
CREATE TABLE robot_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_run_id UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    suite_name VARCHAR(255),
    total_tests INTEGER NOT NULL DEFAULT 0,
    passed_tests INTEGER NOT NULL DEFAULT 0,
    failed_tests INTEGER NOT NULL DEFAULT 0,
    skipped_tests INTEGER NOT NULL DEFAULT 0,
    execution_time_ms INTEGER NOT NULL DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ZAP (Security) results
CREATE TABLE zap_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_run_id UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    scan_name VARCHAR(255),
    target_url VARCHAR(500),
    high_alerts INTEGER NOT NULL DEFAULT 0,
    medium_alerts INTEGER NOT NULL DEFAULT 0,
    low_alerts INTEGER NOT NULL DEFAULT 0,
    info_alerts INTEGER NOT NULL DEFAULT 0,
    scan_timestamp TIMESTAMP WITH TIME ZONE,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- K6 (Load testing) results
CREATE TABLE k6_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_run_id UUID NOT NULL REFERENCES test_runs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    test_name VARCHAR(255),
    vus_max INTEGER,
    iterations INTEGER DEFAULT 0,
    checks_passed INTEGER DEFAULT 0,
    checks_failed INTEGER DEFAULT 0,
    http_req_duration_avg DECIMAL(10,2),
    http_req_duration_p95 DECIMAL(10,2),
    http_req_duration_max DECIMAL(10,2),
    test_duration_ms INTEGER,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification configurations
CREATE TABLE notification_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('slack', 'email', 'webhook')),
    config JSONB NOT NULL,
    triggers JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_test_runs_product_env_type ON test_runs(product_id, environment_id, test_type_id);
CREATE INDEX idx_test_runs_timestamp ON test_runs(run_timestamp);
CREATE INDEX idx_robot_results_test_run ON robot_results(test_run_id);
CREATE INDEX idx_zap_results_test_run ON zap_results(test_run_id);
CREATE INDEX idx_k6_results_test_run ON k6_results(test_run_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);

-- Insert default test types
INSERT INTO test_types (name, description) VALUES 
    ('regression', 'Full regression test suite'),
    ('smoke', 'Basic smoke tests'),
    ('security', 'Security vulnerability scans'),
    ('load', 'Performance and load testing'),
    ('integration', 'Integration testing'),
    ('api', 'API testing'),
    ('e2e', 'End-to-end testing');

-- Create default admin user (password: admin123)
-- Note: In production, this should be changed immediately
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES 
    ('admin@testflux.com', '$2a$10$8K1p/a0dDWDgWZKmnx7Mqu2YQqLN9b9g8K8vT6i5M.ZN3cK3zGz4u', 'Admin', 'User', 'admin');

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_configs_updated_at BEFORE UPDATE ON notification_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
