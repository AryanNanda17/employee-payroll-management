# MERN Employee Payroll Management System

A full-stack, production-grade payroll management application built with MySQL, Express.js, React, and Node.js (MERN stack). Features role-based access control (RBAC), attendance management, salary computation with automated deductions, payslip generation, and comprehensive reporting.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Default Credentials](#default-credentials)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Features

### Admin Portal
- **Dashboard** with real-time statistics, employee distribution charts, and attendance summaries
- **Employee Management** -- full CRUD with photo upload, role assignment, and status tracking
- **Position Management** -- define positions with base salary, transport allowance, and meal allowance
- **Attendance Management** -- monthly attendance tracking with present/sick/absent days
- **Salary Deduction Settings** -- configurable deduction rules (per absent day, per sick day)
- **Salary Computation** -- automatic payroll calculation joining employee, position, attendance, and deduction data
- **Reports** -- salary reports, attendance reports, and individual payslips with print support
- **Change Password** -- secure password update with current password verification

### Employee Portal
- **Personal Dashboard** -- profile overview with position and status information
- **Salary History** -- view personal salary records across all months
- **Change Password** -- self-service password management

### Security
- Session-based authentication with Argon2 password hashing
- Role-based access control (Admin / Employee)
- Protected API routes with middleware guards
- Rate limiting on login endpoint
- Input validation on all endpoints

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Page transitions and animations |
| Axios | HTTP client for API calls |
| React Router v6 | Client-side routing with route guards |
| ApexCharts | Dashboard charts and visualizations |
| React Hot Toast | Notification toasts |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | HTTP server and routing |
| Sequelize | ORM for MySQL |
| Argon2 | Password hashing |
| express-session | Session management |
| connect-session-sequelize | Session store |
| express-rate-limit | Login rate limiting |
| express-fileupload | Photo upload handling |

### Database
| Technology | Purpose |
|-----------|---------|
| MySQL 8+ | Relational database |

### Testing
| Technology | Purpose |
|-----------|---------|
| Jest + Babel | Unit tests with code coverage |
| Mocha + Chai + Sinon | Functional and regression tests |
| Selenium WebDriver | End-to-end browser tests |
| Apache JMeter | Stress and load testing |

## Architecture

```
mern-employee-salary-management/
├── Backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route handlers (Auth, Employee, Position, Attendance, Salary, Dashboard)
│   ├── middleware/        # Auth guards (verifyUser, adminOnly, employeeOnly)
│   ├── models/           # Sequelize models (Employee, Position, Attendance, SalaryDeduction)
│   ├── routes/           # Express route definitions
│   ├── db/               # SQL seed data
│   ├── __tests__/        # Jest unit tests
│   ├── test/             # Mocha functional, regression, and stress tests
│   └── index.js          # Server entry point
├── Frontend/
│   ├── src/
│   │   ├── api/          # Axios instance configuration
│   │   ├── components/   # Reusable UI components (atoms + molecules)
│   │   ├── config/       # Route configuration
│   │   ├── context/      # Auth context provider
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layout/       # Admin and Employee layouts
│   │   ├── pages/        # Page components (Admin + Employee)
│   │   └── assets/       # Images, fonts, icons
│   └── index.html        # Vite HTML entry
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or above
- [MySQL](https://www.mysql.com/) v8 or above
- npm (comes with Node.js)
- [Google Chrome](https://www.google.com/chrome/) (for Selenium tests)
- [Apache JMeter](https://jmeter.apache.org/) (for stress tests, optional)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mern-employee-salary-management.git
cd mern-employee-salary-management
```

### 2. Set up the database

Start your MySQL server, then create the database and import the seed data:

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS employee_salary_management;"
mysql -u root employee_salary_management < Backend/db/employee_salary_management.sql
```

> If your MySQL root user has a password, add `-p` to the commands above.

### 3. Configure the backend environment

Copy the example env file and update values as needed:

```bash
cp Backend/.env.example Backend/.env
```

Edit `Backend/.env`:

```env
APP_PORT=5001
SESS_SECRET=your_session_secret_here
DB_NAME=employee_salary_management
DB_USER=root
DB_PASS=
DB_HOST=localhost
DB_PORT=3306
CLIENT_URL=http://localhost:5173
```

### 4. Install dependencies and start the backend

```bash
cd Backend
npm install
mkdir -p public/images
npm start
```

You should see `Server running on port 5001` in the terminal.

### 5. Install dependencies and start the frontend

Open a **new terminal**:

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**.

### 6. Open the app

Navigate to **http://localhost:5173** in your browser.

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Employee | `priya` | `admin123` |
| Employee | `rahul` | `admin123` |
| Employee | `vikram` | `admin123` |

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Login with username/password | Public |
| GET | `/me` | Get current user session | Session |
| DELETE | `/logout` | Destroy session | Session |
| PATCH | `/change-password` | Change password | Authenticated |

### Employees (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all employees |
| GET | `/employees/:id` | Get employee by ID |
| POST | `/employees` | Create employee (multipart form) |
| PATCH | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

### Positions (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/positions` | List all positions |
| POST | `/positions` | Create position |
| PATCH | `/positions/:id` | Update position |
| DELETE | `/positions/:id` | Delete position |

### Attendance (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | List all attendance records |
| POST | `/attendance` | Create attendance record |
| PATCH | `/attendance/update/:id` | Update attendance record |
| DELETE | `/attendance/:id` | Delete attendance record |

### Salary Deductions (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salary-deductions` | List all deduction rules |
| GET | `/salary-deductions/:id` | Get deduction by ID |
| POST | `/salary-deductions` | Create deduction rule |
| PATCH | `/salary-deductions/:id` | Update deduction rule |
| DELETE | `/salary-deductions/:id` | Delete deduction rule |

### Salary & Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/salary/report?month=` | Salary report for a month | Admin |
| GET | `/salary/slip/:id?month=` | Payslip for an employee | Admin |
| GET | `/salary/my-history` | Own salary history | Authenticated |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/stats` | Dashboard statistics | Authenticated |

### Employee Self-Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/my/profile` | Own profile data | Authenticated |
| GET | `/my/attendance` | Own attendance records | Authenticated |

## Testing

### Unit Tests (Jest + Babel)

Runs all controller and middleware unit tests with code coverage:

```bash
cd Backend
npm test
```

Coverage report is generated in `Backend/coverage/lcov-report/index.html`.

### Functional Tests (Mocha + Chai)

```bash
cd Backend
npm run test:functional
```

### Regression Tests (Mocha + Mochawesome)

Generates an HTML report:

```bash
cd Backend
npm run test:regression
```

Report output: `Backend/reports/regression/regression-report.html`

### Frontend E2E Tests (Selenium WebDriver)

Prerequisites: Chrome browser installed, both frontend and backend running.

```bash
# Terminal 1 - Backend
cd Backend && npm start

# Terminal 2 - Frontend
cd Frontend && npm run dev

# Terminal 3 - Run tests
cd Frontend && npm run test:selenium
```

### Stress Tests (Apache JMeter)

1. Install JMeter from [jmeter.apache.org](https://jmeter.apache.org/)
2. Start the backend server
3. Run the stress test:

```bash
cd Backend
npm run test:stress
```

Or run manually:

```bash
jmeter -n -t test/stress/stress-test-plan.jmx -l reports/stress/results.jtl -e -o reports/stress/html-report
```

Report output: `Backend/reports/stress/html-report/index.html`

## Deployment (Zero Cost)

### Backend -- Render.com

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && node index.js`
   - **Environment Variables**: Set all variables from `.env.example`
4. Deploy

### Frontend -- Vercel

1. Import your repository on [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: `VITE_API_URL=https://your-backend.onrender.com`
3. Deploy

### Database -- Railway or PlanetScale

- **Railway**: Free tier with MySQL, import SQL dump via CLI
- **PlanetScale**: Free tier MySQL-compatible (Vitess), 5GB storage

### Docker

A Dockerfile is provided for the backend:

```bash
cd Backend
docker build -t payroll-backend .
docker run -p 5001:5001 --env-file .env payroll-backend
```

## License

MIT License - see [LICENSE](LICENSE) for details.
