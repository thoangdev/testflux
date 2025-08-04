# Database Documentation

## Schema Overview

The TestFlux database uses PostgreSQL and is designed to efficiently store and query test results from multiple automation frameworks.

## Tables

### Core Tables

#### `users`
Stores user accounts with role-based access control.
- `role`: 'admin' or 'user'
- `is_active`: Soft delete flag

#### `products`
Top-level grouping for test results.
- Each product can have multiple environments
- Soft delete via `is_active`

#### `environments`
Environment configurations per product (e.g., staging, prod).
- Unique constraint on `(product_id, name)`

#### `test_types`
Predefined test categories (regression, smoke, security, load, etc.).

#### `test_runs`
Main metadata table for each test execution.
- Links to product, environment, and test type
- Tracks processing status and source information
- Contains upload metadata

### Results Tables

#### `robot_results`
Robot Framework test execution results.
- Aggregated pass/fail/skip counts
- Execution timing
- Raw XML data stored as JSONB

#### `zap_results`
ZAP security scan results.
- Alert counts by severity (High, Medium, Low, Info)
- Target URL and scan metadata
- Raw scan data as JSONB

#### `k6_results`
K6 load testing results.
- Performance metrics (duration, VUs, iterations)
- HTTP request statistics
- Raw results as JSONB

### Configuration Tables

#### `notification_configs`
Per-product notification settings.
- Supports Slack, email, and webhook notifications
- JSONB configuration for flexible settings
- Trigger conditions stored as JSONB

## Indexes

Performance indexes are created on:
- Frequently queried combinations (product + environment + test type)
- Timestamp fields for trend queries
- Foreign key relationships
- Unique identifiers

## Sample Queries

### Get Recent Test Results
```sql
SELECT 
    p.name as product_name,
    e.name as environment_name,
    tt.name as test_type,
    tr.run_timestamp,
    rr.passed_tests,
    rr.failed_tests,
    rr.execution_time_ms
FROM test_runs tr
JOIN products p ON tr.product_id = p.id
JOIN environments e ON tr.environment_id = e.id
JOIN test_types tt ON tr.test_type_id = tt.id
LEFT JOIN robot_results rr ON tr.id = rr.test_run_id
WHERE tr.run_timestamp >= NOW() - INTERVAL '30 days'
ORDER BY tr.run_timestamp DESC;
```

### Trend Analysis
```sql
SELECT 
    DATE_TRUNC('day', tr.run_timestamp) as date,
    AVG(CASE WHEN rr.total_tests > 0 THEN (rr.passed_tests::float / rr.total_tests) * 100 END) as pass_rate
FROM test_runs tr
JOIN robot_results rr ON tr.id = rr.test_run_id
WHERE tr.product_id = $1 
    AND tr.run_timestamp >= $2
GROUP BY DATE_TRUNC('day', tr.run_timestamp)
ORDER BY date;
```

## Migration Strategy

For production deployment:
1. Run `init.sql` to create the schema
2. Change default admin password
3. Set up proper backup strategy
4. Configure connection pooling
5. Monitor query performance
