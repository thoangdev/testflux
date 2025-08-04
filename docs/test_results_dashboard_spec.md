# Test Results Dashboard - Specification Document

## Overview
We are building a web application to aggregate, store, and visualize automated test results from multiple sources (Robot Framework, ZAP, and k6). The system will support long-term trend analysis, per-product reporting, and customizable notification workflows. It will serve both CI-driven automated uploads and manual archive ingestion.

## Core Features

### ✅ Test Result Ingestion
- Accepts uploads via GitHub Actions or UI/API.
- Supported file types:
  - Robot Framework: XML
  - ZAP: JSON/XML
  - k6: JSON
- Single API call can include multiple result files.
- Results are parsed and stored with relevant metadata (product, environment, test type).

### 📂 Products & Test Types
- Test results are grouped under a "Product".
- Each product can have multiple environments (e.g., `staging`, `prod`).
- Each upload must specify a test type: `regression`, `smoke`, `security`, `load`, etc.
- Segregation ensures trends are scoped per product/environment/test type.

### 🧑‍🤝‍🧑 User Roles
- **Admin**:
  - Add/manage products.
  - Configure settings (webhooks, emails).
  - Manually upload historical result files.
  - Invite/remove users.
- **User**:
  - View trends and results (read-only).

### 📊 Trends & Reporting
- View trends for:
  - Robot Framework: pass/fail rates, execution time.
  - ZAP: vulnerability counts (High, Medium, Low).
  - k6: recommended metrics:
    - `http_req_duration` (avg, p95)
    - `vus_max`, `iterations`, `checks` (pass rate)
- Filters:
  - Custom date ranges (30d, 1y, 5y, etc.)
  - Product
  - Environment
  - Test type

### 📨 Notifications
- Configurable per product:
  - Slack/webhook URLs
  - Email list or distro
  - Triggered on:
    - Any failed test
    - Scheduled summary
    - Custom thresholds (future feature)

### 🗃️ Data Retention
- All test results are stored indefinitely unless deleted by admin.
- Summary and full parsed details are stored in the database.

### 🛠 Manual Upload Support
- Admin can upload archived test result files via web interface.
- Supports bootstrapping trend data from historical runs.

## Tech Stack

### 🌐 Frontend
- React + Tailwind (or shadcn/ui)
- Recharts or Chart.js for visualizations
- Vite for build tooling

### 🔙 Backend
- Node.js with Fastify (preferred for speed)
- REST API for:
  - File upload
  - Results ingestion
  - Product/user management
  - Trend queries

### 🧾 Database
- PostgreSQL
- Tables:
  - Products
  - Environments
  - TestTypes
  - TestRuns (with metadata)
  - RobotResults, ZAPResults, K6Results (normalized per tool)

### 🔁 CI/CD
- GitHub Actions
  - Runs tests
  - Uploads results via API with metadata
  - Example metadata: product, env, test type, run timestamp

### 🔐 Auth & Roles
- Admin/User roles
- Session or token-based login (scalable to SSO later)

### 🚀 Deployment
- Dockerized services
- Can be deployed on Render, Fly.io, or self-hosted via Docker Compose

## Summary
This system enables centralized and structured management of test results across automation layers. By decoupling ingestion from runtime, supporting historic uploads, and offering customizable filters and notifications, it meets both operational and compliance-driven needs for long-term trend visibility.

