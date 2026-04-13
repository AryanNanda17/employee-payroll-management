/**
 * Regression Test Suite
 * Framework: Mocha + Chai + Sinon
 * Reporter: mochawesome (generates HTML report)
 * Run: npm run test:regression
 *
 * This suite re-runs all functional tests plus additional edge cases
 * and boundary value tests to ensure no regressions have been introduced.
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Employee from '../../models/EmployeeModel.js';
import Position from '../../models/PositionModel.js';
import Attendance from '../../models/AttendanceModel.js';
import argon2 from 'argon2';
import { Login, Me, LogOut } from '../../controllers/Auth.js';
import { getEmployees, getEmployeeById, createEmployee, deleteEmployee } from '../../controllers/EmployeeController.js';
import { getPositions, createPosition, updatePosition, deletePosition } from '../../controllers/PositionController.js';
import { getAttendance, createAttendance, updateAttendance, deleteAttendance } from '../../controllers/TransactionController.js';
import { verifyUser, adminOnly } from '../../middleware/AuthUser.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

// ============================================================
// REGRESSION TEST SUITE
// ============================================================

describe('REGRESSION TEST SUITE', function() {
    afterEach(function() {
        sinon.restore();
    });

    // ----------------------------------------------------------
    // 1. Authentication Regression Tests
    // ----------------------------------------------------------
    describe('1. Authentication Module Regression', function() {

        describe('1.1 Login Regression', function() {
            it('REG-AUTH-001: Login with valid admin credentials', async function() {
                const admin = {
                    id: 1, employee_uuid: 'uuid-admin',
                    password: '$argon2hash', employee_name: 'Admin User',
                    username: 'admin', role: 'admin'
                };
                sinon.stub(Employee, 'findOne').resolves(admin);
                sinon.stub(argon2, 'verify').resolves(true);

                const req = createMockReq({ body: { username: 'admin', password: 'admin123' }, session: {} });
                const res = createMockRes();

                await Login(req, res);

                expect(res.status.calledWith(200)).to.be.true;
                expect(req.session.userId).to.equal('uuid-admin');
            });

            it('REG-AUTH-002: Login with valid employee credentials', async function() {
                const employee = {
                    id: 5, employee_uuid: 'uuid-emp',
                    password: '$argon2hash', employee_name: 'Employee',
                    username: 'emp1', role: 'employee'
                };
                sinon.stub(Employee, 'findOne').resolves(employee);
                sinon.stub(argon2, 'verify').resolves(true);

                const req = createMockReq({ body: { username: 'emp1', password: 'emp123' }, session: {} });
                const res = createMockRes();

                await Login(req, res);

                expect(res.status.calledWith(200)).to.be.true;
                const responseData = res.json.firstCall.args[0];
                expect(responseData.role).to.equal('employee');
            });

            it('REG-AUTH-003: Login with non-existent username', async function() {
                sinon.stub(Employee, 'findOne').resolves(null);

                const req = createMockReq({ body: { username: 'ghost', password: 'any' } });
                const res = createMockRes();

                await Login(req, res);

                expect(res.status.calledWith(404)).to.be.true;
            });

            it('REG-AUTH-004: Login with wrong password', async function() {
                sinon.stub(Employee, 'findOne').resolves({
                    id: 1, employee_uuid: 'uuid-1', password: 'hash',
                    employee_name: 'Test', username: 'test', role: 'admin'
                });
                sinon.stub(argon2, 'verify').resolves(false);

                const req = createMockReq({ body: { username: 'test', password: 'wrong' } });
                const res = createMockRes();

                await Login(req, res);

                expect(res.status.calledWith(400)).to.be.true;
            });

            it('REG-AUTH-005: Login with empty username', async function() {
                sinon.stub(Employee, 'findOne').resolves(null);

                const req = createMockReq({ body: { username: '', password: 'pass' } });
                const res = createMockRes();

                await Login(req, res);

                expect(res.status.calledWith(404)).to.be.true;
            });

            it('REG-AUTH-006: Login with empty password', async function() {
                sinon.stub(Employee, 'findOne').resolves({
                    id: 1, employee_uuid: 'uuid-1', password: 'hash',
                    employee_name: 'Test', username: 'test', role: 'admin'
                });
                sinon.stub(argon2, 'verify').resolves(false);

                const req = createMockReq({ body: { username: 'test', password: '' } });
                const res = createMockRes();

                await Login(req, res);

                expect(res.status.calledWith(400)).to.be.true;
            });
        });

        describe('1.2 Session (Me) Regression', function() {
            it('REG-AUTH-007: Me with valid session', async function() {
                sinon.stub(Employee, 'findOne').resolves({
                    id: 1, employee_name: 'Admin', username: 'admin', role: 'admin'
                });

                const req = createMockReq({ session: { userId: 'uuid-1' } });
                const res = createMockRes();

                await Me(req, res);

                expect(res.status.calledWith(200)).to.be.true;
            });

            it('REG-AUTH-008: Me without session', async function() {
                const req = createMockReq({ session: {} });
                const res = createMockRes();

                await Me(req, res);

                expect(res.status.calledWith(401)).to.be.true;
            });

            it('REG-AUTH-009: Me with expired/invalid session', async function() {
                sinon.stub(Employee, 'findOne').resolves(null);

                const req = createMockReq({ session: { userId: 'expired-uuid' } });
                const res = createMockRes();

                await Me(req, res);

                expect(res.status.calledWith(404)).to.be.true;
            });
        });

        describe('1.3 Logout Regression', function() {
            it('REG-AUTH-010: Successful logout', function() {
                const req = createMockReq({
                    session: { destroy: sinon.stub().callsFake(cb => cb(null)) }
                });
                const res = createMockRes();

                LogOut(req, res);

                expect(res.status.calledWith(200)).to.be.true;
            });

            it('REG-AUTH-011: Logout with session error', function() {
                const req = createMockReq({
                    session: { destroy: sinon.stub().callsFake(cb => cb(new Error('fail'))) }
                });
                const res = createMockRes();

                LogOut(req, res);

                expect(res.status.calledWith(400)).to.be.true;
            });
        });
    });

    // ----------------------------------------------------------
    // 2. Employee CRUD Regression Tests
    // ----------------------------------------------------------
    describe('2. Employee Module Regression', function() {

        it('REG-EMP-001: Get all employees returns correct data', async function() {
            const employees = [{ id: 1, nik: '001', employee_name: 'E1' }];
            sinon.stub(Employee, 'findAll').resolves(employees);

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(employees)).to.be.true;
        });

        it('REG-EMP-002: Get employee by valid ID', async function() {
            sinon.stub(Employee, 'findOne').resolves({ id: 1, nik: '001' });

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await getEmployeeById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-EMP-003: Get employee by invalid ID returns 404', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ params: { id: 99999 } });
            const res = createMockRes();

            await getEmployeeById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('REG-EMP-004: Create employee with mismatched passwords', async function() {
            const req = createMockReq({
                body: { password: 'abc', confirmPassword: 'xyz' },
                files: { photo: { name: 't.jpg', data: Buffer.alloc(10), md5: 'a', mv: sinon.stub() } }
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('REG-EMP-005: Create employee without file upload', async function() {
            const req = createMockReq({
                body: { password: 'abc', confirmPassword: 'abc' },
                files: null
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('REG-EMP-006: Delete existing employee', async function() {
            sinon.stub(Employee, 'findOne').resolves({ id: 1 });
            sinon.stub(Employee, 'destroy').resolves(1);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteEmployee(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-EMP-007: Delete non-existent employee', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ params: { id: 999 } });
            const res = createMockRes();

            await deleteEmployee(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('REG-EMP-008: Get employees handles DB error gracefully', async function() {
            sinon.stub(Employee, 'findAll').rejects(new Error('DB down'));

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    // ----------------------------------------------------------
    // 3. Position CRUD Regression Tests
    // ----------------------------------------------------------
    describe('3. Position Module Regression', function() {

        it('REG-POS-001: Get all positions as admin', async function() {
            sinon.stub(Position, 'findAll').resolves([{ id: 1, position_name: 'Manager' }]);

            const req = createMockReq({ role: 'admin' });
            const res = createMockRes();

            await getPositions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-POS-002: Create position as admin', async function() {
            sinon.stub(Position, 'create').resolves({});

            const req = createMockReq({
                role: 'admin', userId: 1,
                body: { position_name: 'Dev', basic_salary: 5000000, transport_allowance: 500000, meal_allowance: 300000 }
            });
            const res = createMockRes();

            await createPosition(req, res);

            expect(res.status.calledWith(201)).to.be.true;
        });

        it('REG-POS-003: Update existing position', async function() {
            sinon.stub(Position, 'findOne').resolves({ id: 1 });
            sinon.stub(Position, 'update').resolves([1]);

            const req = createMockReq({
                role: 'admin', params: { id: 1 },
                body: { position_name: 'Updated', basic_salary: 6000000, transport_allowance: 600000, meal_allowance: 400000 }
            });
            const res = createMockRes();

            await updatePosition(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-POS-004: Update non-existent position', async function() {
            sinon.stub(Position, 'findOne').resolves(null);

            const req = createMockReq({
                role: 'admin', params: { id: 999 }
            });
            const res = createMockRes();

            await updatePosition(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('REG-POS-005: Delete existing position', async function() {
            sinon.stub(Position, 'findOne').resolves({
                id: 1, destroy: sinon.stub().resolves()
            });

            const req = createMockReq({ role: 'admin', params: { id: 1 } });
            const res = createMockRes();

            await deletePosition(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-POS-006: Delete non-existent position', async function() {
            sinon.stub(Position, 'findOne').resolves(null);

            const req = createMockReq({ role: 'admin', params: { id: 999 } });
            const res = createMockRes();

            await deletePosition(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    // ----------------------------------------------------------
    // 4. Attendance Regression Tests
    // ----------------------------------------------------------
    describe('4. Attendance Module Regression', function() {

        it('REG-ATT-001: View all attendance data', async function() {
            sinon.stub(Attendance, 'findAll').resolves([{ id: 1, present: 22 }]);

            const req = createMockReq();
            const res = createMockRes();

            await getAttendance(req, res);

            expect(res.json.called).to.be.true;
        });

        it('REG-ATT-002: Create attendance for valid employee', async function() {
            sinon.stub(Employee, 'findOne')
                .onFirstCall().resolves({ employee_name: 'John' })
                .onSecondCall().resolves({ nik: '001' });
            sinon.stub(Position, 'findOne').resolves({ position_name: 'Manager' });
            sinon.stub(Attendance, 'findOne').resolves(null);
            sinon.stub(Attendance, 'create').resolves({});

            const req = createMockReq({
                body: {
                    month: 'March', nik: '001', employee_name: 'John',
                    gender: 'Male', position_name: 'Manager',
                    present: 22, sick: 0, absent: 0
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.json.calledWith({ msg: "Attendance data added successfully" })).to.be.true;
        });

        it('REG-ATT-003: Create attendance for non-existent employee', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);
            sinon.stub(Position, 'findOne').resolves(null);
            sinon.stub(Attendance, 'findOne').resolves(null);

            const req = createMockReq({
                body: { employee_name: 'Ghost', position_name: 'Manager', nik: '000' }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('REG-ATT-004: Update attendance record', async function() {
            sinon.stub(Attendance, 'update').resolves([1]);

            const req = createMockReq({
                params: { id: 1 },
                body: { present: 20, sick: 2, absent: 1 }
            });
            const res = createMockRes();

            await updateAttendance(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-ATT-005: Delete attendance record', async function() {
            sinon.stub(Attendance, 'destroy').resolves(1);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteAttendance(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });
    });

    // ----------------------------------------------------------
    // 5. Middleware Regression Tests
    // ----------------------------------------------------------
    describe('5. Middleware Regression', function() {

        it('REG-MW-001: verifyUser blocks unauthenticated request', async function() {
            const req = createMockReq({ session: {} });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(next.called).to.be.false;
        });

        it('REG-MW-002: verifyUser passes authenticated request', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1, role: 'admin'
            });

            const req = createMockReq({ session: { userId: 'uuid-1' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('REG-MW-003: adminOnly allows admin user', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1, role: 'admin'
            });

            const req = createMockReq({ session: { userId: 'uuid-admin' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('REG-MW-004: adminOnly blocks non-admin user', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 5, role: 'employee'
            });

            const req = createMockReq({ session: { userId: 'uuid-emp' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(res.status.calledWith(403)).to.be.true;
            expect(next.called).to.be.false;
        });

        it('REG-MW-005: verifyUser handles deleted user session', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ session: { userId: 'deleted-uuid' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('REG-MW-006: adminOnly handles DB failure', async function() {
            sinon.stub(Employee, 'findOne').rejects(new Error('Timeout'));

            const req = createMockReq({ session: { userId: 'uuid-1' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    // ----------------------------------------------------------
    // 6. Boundary Value Tests
    // ----------------------------------------------------------
    describe('6. Boundary Value Tests', function() {

        it('REG-BV-001: Employee NIK at max length (16 chars)', async function() {
            sinon.stub(Employee, 'findAll').resolves([
                { id: 1, nik: '1234567890123456', employee_name: 'Max NIK' }
            ]);

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('REG-BV-002: Position with zero salary', async function() {
            sinon.stub(Position, 'create').resolves({});

            const req = createMockReq({
                role: 'admin', userId: 1,
                body: { position_name: 'Intern', basic_salary: 0, transport_allowance: 0, meal_allowance: 0 }
            });
            const res = createMockRes();

            await createPosition(req, res);

            expect(res.status.calledWith(201)).to.be.true;
        });

        it('REG-BV-003: Attendance with max days (31)', async function() {
            sinon.stub(Employee, 'findOne')
                .onFirstCall().resolves({ employee_name: 'John' })
                .onSecondCall().resolves({ nik: '001' });
            sinon.stub(Position, 'findOne').resolves({ position_name: 'Staff' });
            sinon.stub(Attendance, 'findOne').resolves(null);
            sinon.stub(Attendance, 'create').resolves({});

            const req = createMockReq({
                body: {
                    month: 'January', nik: '001', employee_name: 'John',
                    gender: 'Male', position_name: 'Staff',
                    present: 31, sick: 0, absent: 0
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.json.calledWith({ msg: "Attendance data added successfully" })).to.be.true;
        });

        it('REG-BV-004: File size exactly at 2MB limit', async function() {
            const req = createMockReq({
                body: {
                    password: 'pass123', confirmPassword: 'pass123',
                    nik: '003', employee_name: 'Boundary',
                    username: 'boundary', gender: 'Male',
                    position: 'Staff', join_date: '2024-01-01',
                    status: 'active', role: 'employee'
                },
                files: {
                    photo: {
                        name: 'exact2mb.jpg',
                        data: Buffer.alloc(2000000),
                        md5: 'exact2mb',
                        mv: sinon.stub().callsFake((path, cb) => cb(null))
                    }
                }
            });
            const res = createMockRes();

            sinon.stub(argon2, 'hash').resolves('$hashed');
            sinon.stub(Employee, 'create').resolves({});

            await createEmployee(req, res);
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(res.status.calledWith(201)).to.be.true;
        });

        it('REG-BV-005: File size just over 2MB limit', async function() {
            const req = createMockReq({
                body: {
                    password: 'pass123', confirmPassword: 'pass123',
                    nik: '003', employee_name: 'Over',
                    username: 'over', gender: 'Male',
                    position: 'Staff', join_date: '2024-01-01',
                    status: 'active', role: 'employee'
                },
                files: {
                    photo: {
                        name: 'over2mb.jpg',
                        data: Buffer.alloc(2000001),
                        md5: 'over2mb',
                        mv: sinon.stub()
                    }
                }
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(422)).to.be.true;
        });
    });

    // ----------------------------------------------------------
    // 7. Integration Flow Tests
    // ----------------------------------------------------------
    describe('7. Integration Flow Regression', function() {

        it('REG-INT-001: Full auth flow - login then check session then logout', async function() {
            const employee = {
                id: 1, employee_uuid: 'uuid-flow',
                password: 'hash', employee_name: 'Flow User',
                username: 'flow', role: 'admin'
            };

            sinon.stub(Employee, 'findOne').resolves(employee);
            sinon.stub(argon2, 'verify').resolves(true);

            const session = {};

            const loginReq = createMockReq({ body: { username: 'flow', password: 'pass' }, session });
            const loginRes = createMockRes();
            await Login(loginReq, loginRes);

            expect(session.userId).to.equal('uuid-flow');
            expect(loginRes.status.calledWith(200)).to.be.true;

            const meReq = createMockReq({ session });
            const meRes = createMockRes();
            await Me(meReq, meRes);

            expect(meRes.status.calledWith(200)).to.be.true;

            let destroyed = false;
            session.destroy = sinon.stub().callsFake(cb => { destroyed = true; cb(null); });
            const logoutReq = createMockReq({ session });
            const logoutRes = createMockRes();
            LogOut(logoutReq, logoutRes);

            expect(destroyed).to.be.true;
            expect(logoutRes.status.calledWith(200)).to.be.true;
        });

        it('REG-INT-002: Employee CRUD cycle - create then get then delete', async function() {
            sinon.stub(argon2, 'hash').resolves('$hashed');
            const createStub = sinon.stub(Employee, 'create').resolves({});
            const findOneStub = sinon.stub(Employee, 'findOne');
            const findAllStub = sinon.stub(Employee, 'findAll');
            const destroyStub = sinon.stub(Employee, 'destroy').resolves(1);

            const mvStub = sinon.stub().callsFake((path, cb) => cb(null));
            const createReq = createMockReq({
                body: {
                    nik: '010', employee_name: 'Cycle Test',
                    username: 'cycle', password: 'pass', confirmPassword: 'pass',
                    gender: 'Male', position: 'Staff',
                    join_date: '2024-06-01', status: 'active', role: 'employee'
                },
                files: { photo: { name: 'c.jpg', data: Buffer.alloc(100), md5: 'cyc', mv: mvStub } }
            });
            const createRes = createMockRes();
            await createEmployee(createReq, createRes);
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(createRes.status.calledWith(201)).to.be.true;

            findAllStub.resolves([{ id: 10, nik: '010', employee_name: 'Cycle Test' }]);
            const getAllReq = createMockReq();
            const getAllRes = createMockRes();
            await getEmployees(getAllReq, getAllRes);
            expect(getAllRes.status.calledWith(200)).to.be.true;

            findOneStub.resolves({ id: 10 });
            const deleteReq = createMockReq({ params: { id: 10 } });
            const deleteRes = createMockRes();
            await deleteEmployee(deleteReq, deleteRes);
            expect(deleteRes.status.calledWith(200)).to.be.true;
        });
    });
});
