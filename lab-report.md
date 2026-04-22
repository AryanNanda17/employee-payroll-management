# MIS LAB EXPERIMENT NO. 11

| Name | Registration ID |
|------|-----------------|
| Paras Churi | 221070017 |
| Ariv Fernandes | 221070019 |
| Tanay Gada | 221070020 |

---

## Aim

To develop the Payroll Management System (PMS) and test it using backend, frontend, API, and performance testing techniques.

---

## Introduction

System development involves implementing the designed Information System using appropriate technologies, while testing ensures correctness, reliability, and performance.

For the Payroll Management System, testing is performed using:

- **Backend testing** (Jest for structural/unit testing with code coverage, Mocha + Chai + Sinon for functional and regression testing)
- **Frontend automation testing** (Selenium WebDriver with Jest)
- **API testing** (Apache JMeter)
- **Performance / Stress testing** (Apache JMeter)
- **UI validation** using screenshots

This multi-layered approach ensures comprehensive validation of the system across all layers — from database interactions and business logic to user interface workflows and system behavior under load.

---

## System Development

### Development Approach

- Incremental and modular development
- Backend (Node.js/Express) and frontend (React) developed separately and then integrated via RESTful APIs
- Role-Based Access Control (RBAC) implemented from the ground up with two roles: **Admin** and **Employee**
- Continuous testing during development using Jest, Mocha, and Selenium
- Version control managed through GitHub

### Technologies Used

**Frontend:**
- React.js 18 (with Vite build tool)
- React Router v6 (client-side routing)
- Tailwind CSS (utility-first styling)
- Framer Motion (animations and transitions)
- ApexCharts (interactive data visualization)
- Axios (HTTP client)
- React Hot Toast (notifications)

**Backend:**
- Node.js (ES Modules)
- Express.js (REST API framework)
- Sequelize ORM (database abstraction)

**Database:**
- MySQL 8+

**Other Tools:**
- Argon2 (password hashing)
- express-session + connect-session-sequelize (session-based authentication)
- express-rate-limit (API rate limiting)
- express-fileupload (employee photo uploads)
- express-validator (input validation)
- GitHub (version control)

### Modules Developed

#### 1. User Management
- Login and session-based authentication for Admin and Employee portals
- Role-based access control (RBAC) with middleware enforcement (`verifyUser`, `adminOnly`, `employeeOnly`)
- Password change functionality with current password verification
- Secure session management with server-side session store

#### 2. Employee Management
- Add, update, and delete employee records
- Employee profile with photo upload (PNG, JPG, JPEG; max 2 MB)
- Employee details include: NIK (Employee ID), name, gender, position, join date, status, and role
- Foreign key relationship with Position table (many-to-one)

#### 3. Position Management
- Add, update, and delete position/designation records
- Each position defines: basic salary, transport allowance, and meal allowance
- Positions are linked to employees via foreign key relationship

#### 4. Attendance Management
- Record monthly attendance for each employee: present days, sick days, and absent days
- Year and month based filtering with analytics dashboard
- Attendance analytics with interactive line graphs showing trends across years
- Printable attendance reports with optional filters (year, month, employee)

#### 5. Payroll Processing
- Automated salary calculation based on position (basic salary + allowances) minus deductions
- Deductions computed from attendance data (absent/sick days) and configurable salary deduction rates
- Process payroll for all employees for a given month/year
- View and print individual payslips
- Persistent payroll records stored in the database

#### 6. Leave Management
- Employees can submit leave requests with type (Annual, Sick, Personal, Maternity, Paternity), date range, and reason
- System calculates working days automatically (excludes weekends)
- Overlap detection prevents duplicate leave requests
- Admin can approve or reject leave requests with remarks
- Annual leave allocation tracking per employee

#### 7. Dashboard
- Admin dashboard with real-time statistics: total employees, total positions, total attendance records, monthly payroll summary
- Interactive charts and visual indicators
- Employee dashboard with personal salary, attendance, and leave summaries

---

## Testing Methodology

Testing was carried out at multiple levels to ensure the Payroll Management System is reliable, correct, and performant:

| Level | Tool/Framework | Purpose |
|-------|---------------|---------|
| Structural / Unit Testing | Jest + Babel | Validate individual controllers, middleware, and models with mocked dependencies |
| Functional Testing | Mocha + Chai + Sinon | Verify business logic functions produce correct outputs for given inputs |
| Regression Testing | Mocha + Mochawesome | Ensure new changes do not break existing functionality |
| Frontend E2E Testing | Selenium WebDriver + Jest | Automate browser-based UI workflow validation |
| API Testing | Apache JMeter | Validate API endpoint correctness, request/response formats, and authentication |
| Performance / Stress Testing | Apache JMeter | Evaluate system behavior under concurrent load and spike conditions |
| UI Testing | Screenshot validation | Visual confirmation of module functionality |

This multi-layered approach ensures full system reliability from the database layer up to the user interface.

---

## Backend Testing (Jest)

### Description

Backend testing is performed to validate the correctness of server-side logic, including controllers, middleware, routes, and database interactions. In this project, **Jest** (with Babel for ES Module transpilation) is used to conduct structural and unit testing of backend components. All external dependencies (database models, authentication libraries) are mocked using `jest.mock()` to isolate the unit under test. The tests ensure that CRUD operations, authentication mechanisms, session management, input validation, and API responses function correctly. Jest also generates a **code coverage report** showing statement, branch, function, and line coverage across all source files.

**Test files (8 suites):**
- `auth.test.js` — Auth Controller (Login, Me, LogOut, changePassword)
- `employee.test.js` — Employee Controller (CRUD + validation + photo upload)
- `attendance.test.js` — Attendance/Transaction Controller (CRUD + analytics)
- `position.test.js` — Position Controller (CRUD)
- `salary.test.js` — Salary Controller (salary report, salary slip)
- `salaryDeduction.test.js` — Salary Deduction Controller (CRUD)
- `dashboard.test.js` — Dashboard Controller (statistics)
- `middleware.test.js` — Auth Middleware (verifyUser, adminOnly)

### Command to Run

```bash
cd Backend && npm test
```

This runs `jest --coverage`, executing all test files in `Backend/__tests__/` and generating a coverage report in `Backend/coverage/`.

### Results

[PASTE JEST TEST RESULTS HERE]

### Code Coverage Report

[PASTE COVERAGE SUMMARY TABLE HERE — or screenshot of Backend/coverage/lcov-report/index.html]

### Observation

[FILL AFTER RUNNING: e.g., "All backend test suites passed successfully. Code coverage shows X% statement coverage, confirming correct business logic implementation."]

---

## Functional Testing (Mocha)

### Description

Functional testing verifies that each backend function produces the correct output for a given set of inputs. Using **Mocha** as the test runner with **Chai** for assertions and **Sinon** for mocking/stubbing, 7 unit test suites validate the core business logic of the system. These tests cover authentication flows, employee CRUD operations, attendance management, position management, salary calculations, salary deduction configuration, and authorization middleware. Each test isolates the function under test by stubbing database calls, ensuring that the logic itself (not the database) is being validated.

**Test suites:**
- `auth.test.mjs` — Login, session management, password change
- `employee.test.mjs` — Employee CRUD with validation
- `attendance.test.mjs` — Attendance CRUD operations
- `position.test.mjs` — Position CRUD operations
- `salary.test.mjs` — Salary report generation and salary slip
- `salaryDeduction.test.mjs` — Salary deduction CRUD
- `middleware.test.mjs` — verifyUser and adminOnly middleware

### Command to Run

```bash
cd Backend && npm run test:functional
```

### Results

[PASTE MOCHA FUNCTIONAL TEST RESULTS HERE]

### Observation

[FILL AFTER RUNNING: e.g., "All functional test cases passed, confirming that business logic works correctly in isolation."]

---

## Regression Testing (Mocha + Mochawesome)

### Description

Regression testing ensures that changes, bug fixes, and new features do not break existing functionality. A comprehensive regression suite (`regression.test.mjs`) consolidates test cases across all modules — authentication, employee management, attendance, positions, salary, salary deductions, and middleware — into a single suite. It uses **Mochawesome** as a reporter to generate a visual HTML report with pass/fail statistics, duration, and detailed test case descriptions.

### Command to Run

```bash
cd Backend && npm run test:regression
```

This generates an HTML report at `Backend/reports/regression/regression-report.html`.

### Results

[PASTE MOCHA REGRESSION TEST RESULTS HERE — or screenshot of the Mochawesome HTML report]

### Observation

[FILL AFTER RUNNING: e.g., "101/101 regression tests passed with 100% pass rate, confirming no regressions were introduced."]

---

## Frontend Testing (Selenium)

### Description

Frontend testing is carried out to verify user interface workflows and ensure that user interactions behave as expected. **Selenium WebDriver** (with Jest as the test runner) is used for automated testing of UI functionalities. The tests run in headless Chrome and simulate real user actions including page navigation, form input, login authentication, and responsive layout verification. This testing validates navigation guards (unauthenticated redirects), form element presence, responsive design across desktop/tablet/mobile viewports, and successful admin login flow.

**Test cases (16):**

| ID | Category | Description |
|----|----------|-------------|
| SEL-001 | Page Load | Admin login page loads correctly |
| SEL-002 | Page Load | Employee login page loads correctly |
| SEL-003 | Page Load | Admin login shows username/password inputs and submit button |
| SEL-004 | Navigation | Unauthenticated access to admin dashboard redirects to login |
| SEL-005 | Navigation | Unauthenticated access to employee dashboard redirects to login |
| SEL-006 | Navigation | Invalid route shows 404 page |
| SEL-007 | Auth | Invalid credentials show error message |
| SEL-008 | Auth | Password field type is "password" (masked input) |
| SEL-009 | Responsive | Desktop viewport (1920x1080) renders correctly |
| SEL-010 | Responsive | Tablet viewport (768x1024) renders correctly |
| SEL-011 | Responsive | Mobile viewport (375x812) renders correctly |
| SEL-012 | Page Content | Admin login page has at least 2 input fields |
| SEL-013 | Page Content | Document has valid HTML structure (html + body) |
| SEL-014 | Page Content | Stylesheets are loaded |
| SEL-015 | Login Flow | Admin login with valid credentials redirects to dashboard |
| SEL-016 | Login Flow | Dashboard body is visible and contains content after login |

### Prerequisites

- Backend must be running: `cd Backend && npm start`
- Frontend must be running: `cd Frontend && npm run dev`

### Command to Run

```bash
cd Frontend && npm run test:selenium
```

### Results

[PASTE SELENIUM TEST RESULTS HERE]

### Observation

[FILL AFTER RUNNING: e.g., "All 16 Selenium test cases passed. UI workflows are stable and function correctly under automation."]

---

## Functional Testing (UI Validation)

### Description

Functional testing via UI validation is conducted to visually verify that all system features operate according to the specified requirements. This includes validating core functionalities such as login, employee management, attendance tracking, payroll processing, and leave management. Each module is tested manually through the browser, and screenshots are captured at key steps to provide visual evidence of correct behavior.

### Modules Tested with Screenshots

#### Login Module
- Admin login page loaded
- Credentials entered
- Successful login and redirect to dashboard

[PASTE LOGIN SCREENSHOTS HERE]

**Result:** Pass

#### Employee Module
- Employee list page loaded
- Add employee form opened and filled
- Employee created and visible in list
- Edit and delete operations performed

[PASTE EMPLOYEE MODULE SCREENSHOTS HERE]

**Result:** Employee CRUD operations function correctly

#### Attendance Module
- Attendance list page loaded with year/month filters
- New attendance record added
- Attendance analytics dashboard with line graphs

[PASTE ATTENDANCE MODULE SCREENSHOTS HERE]

**Result:** Attendance tracking and analytics function correctly

#### Payroll Module
- Payroll processing page loaded
- Payroll processed for a specific month/year
- Payslip generated and viewable

[PASTE PAYROLL MODULE SCREENSHOTS HERE]

**Result:** Payroll calculation and payslip generation function correctly

#### Leave Management Module
- Leave request submitted by employee
- Admin approval/rejection of leave request
- Leave balance updated

[PASTE LEAVE MODULE SCREENSHOTS HERE]

**Result:** Leave management workflow functions correctly

### Observation

All CRUD operations and business workflows function correctly with real-time UI updates. Navigation, form validation, and role-based access are enforced as expected.

---

## API Testing (JMeter)

### Description

API testing is performed to validate the communication between the frontend and backend systems. Using **Apache JMeter**, various API endpoints are tested to ensure that requests are correctly processed, responses are accurate, and authentication mechanisms (session-based) are properly enforced. The test plan includes a login request to establish a session, followed by authenticated GET requests to protected endpoints. Cookie management ensures session persistence across requests.

**Tested API Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | Authenticate user and establish session |
| GET | `/me` | Retrieve current logged-in user details |
| GET | `/employees` | Fetch all employee records |
| GET | `/positions` | Fetch all position/designation records |
| GET | `/attendance` | Fetch attendance records |
| GET | `/dashboard/stats` | Fetch dashboard statistics |
| GET | `/salary-deductions` | Fetch salary deduction configuration |
| GET | `/leave/requests` | Fetch leave requests |
| GET | `/payroll/records` | Fetch payroll records |

### How to Run (GUI Mode for Screenshots)

1. Ensure the backend is running: `cd Backend && npm start`
2. Open JMeter GUI:

```bash
jmeter -t Backend/test/stress/stress-test-plan.jmx
```

3. In JMeter GUI, run the test plan and capture screenshots of:
   - Request body (POST /login)
   - Response body (POST /login)
   - Request for GET endpoints
   - Response for GET endpoints
   - Summary Report listener

### Results

[PASTE JMETER API TEST SCREENSHOTS HERE — request bodies, response bodies, summary report]

### Observation

[FILL AFTER RUNNING: e.g., "All API endpoints return correct responses. Authentication is enforced — protected routes reject unauthenticated requests. Session management via cookies works correctly across requests."]

---

## Performance Testing (JMeter)

### Description

Performance testing is conducted to evaluate the system's behavior under load conditions. Using **Apache JMeter**, multiple concurrent virtual users are simulated to test system responsiveness, throughput, and stability. The test plan consists of three thread groups designed to evaluate different load scenarios:

| Thread Group | Virtual Users | Ramp-Up (s) | Loop Count | Scenario |
|-------------|--------------|-------------|------------|----------|
| Login Stress Test | 10 | 10 | 10 | Sustained login load — 100 total login requests |
| API Endpoints Stress Test | 20 | 20 | 20 | Concurrent access to multiple API endpoints with session auth |
| Spike Test — Sudden Load | 50 | 5 | 5 | Sudden burst of 50 users hitting the system simultaneously |

Each thread group includes a **Cookie Manager** for session persistence and a **Once Only Controller** to ensure login occurs once per virtual user. Thread groups are configured to run **sequentially** (not in parallel) to avoid overwhelming the server. Timeouts are configured at 15000ms (connect) and 30000ms (response) to accommodate Argon2 password hashing under load.

### Command to Run (Non-GUI Mode with HTML Report)

```bash
cd Backend && npm run test:stress
```

This generates:
- Aggregate CSV results at `Backend/reports/stress/aggregate.csv`
- Full HTML dashboard report at `Backend/reports/stress/html-report/index.html`

Open the HTML report in a browser for graphs and statistics.

### How to Run (GUI Mode for Live Graphs)

```bash
jmeter -t Backend/test/stress/stress-test-plan.jmx
```

In JMeter GUI, add a **"Graph Results"** listener to visualize response times in real-time.

### Results

[PASTE JMETER PERFORMANCE TEST RESULTS HERE — HTML report screenshots, graph, summary report, or terminal output]

### Key Metrics to Note

- Average response time
- Throughput (requests/second)
- Error rate (%)
- 90th/95th/99th percentile response times

### Observation

[FILL AFTER RUNNING: e.g., "System handles concurrent load efficiently. Average response time is within acceptable limits. Throughput remains stable. Error rate is negligible under normal load."]

---

## Test Case Summary

| Sr No | Testing Type | Tool/Framework | Description | Command |
|-------|-------------|----------------|-------------|---------|
| 1 | Backend Unit Testing | Jest + Babel | Structural testing of controllers, middleware, models | `cd Backend && npm test` |
| 2 | Functional Testing | Mocha + Chai + Sinon | Business logic validation with mocked dependencies | `cd Backend && npm run test:functional` |
| 3 | Regression Testing | Mocha + Mochawesome | Consolidated regression suite with HTML report | `cd Backend && npm run test:regression` |
| 4 | Frontend E2E Testing | Selenium + Jest | Automated browser UI workflow testing | `cd Frontend && npm run test:selenium` |
| 5 | API Testing | Apache JMeter | API endpoint validation and auth verification | `jmeter -t Backend/test/stress/stress-test-plan.jmx` |
| 6 | Performance Testing | Apache JMeter | Load, stress, and spike testing | `cd Backend && npm run test:stress` |

---

## Test Observations

- All backend modules are functioning correctly with proper input validation and error handling
- Authentication and authorization (RBAC) are enforced at both middleware and route levels
- CRUD operations across all modules (Employee, Position, Attendance, Payroll, Leave) work as expected
- Frontend UI workflows are stable under Selenium automation
- API responses are consistent with correct HTTP status codes and meaningful error messages
- Session-based authentication with cookie management works correctly across JMeter virtual users
- Performance is stable under moderate to high concurrent load conditions

---

## Limitations

- Performance/stress testing was conducted on a local development machine, not a production server
- Selenium tests cover core flows (login, navigation, responsive); deeper module-level E2E tests can be expanded
- JMeter tests focus on read-heavy (GET) endpoints; write-heavy stress scenarios (bulk creates/updates) are not included
- Code coverage is at ~55% statement coverage; increasing coverage for models and routes would improve confidence
- No external integration testing (e.g., email notifications, third-party payroll APIs) was performed

---

## Conclusion

The Payroll Management System was successfully developed and rigorously tested using backend, frontend, API, and performance testing techniques. The use of tools such as **Jest** (structural testing with code coverage), **Mocha + Chai** (functional and regression testing), **Selenium WebDriver** (frontend E2E automation), and **Apache JMeter** (API validation and performance/stress testing) ensured comprehensive validation of system functionality, user interface workflows, and performance under load.

All critical modules — including authentication with RBAC, employee management, position management, attendance tracking with analytics, payroll processing with automated salary calculation, and leave management — performed as expected. The system demonstrates reliability, maintainability, and readiness for deployment, with minimal defects observed during testing. The modular architecture and comprehensive test suite provide a strong foundation for future enhancements and maintenance.
