/**
 * Functional & Unit Testing - Salary Controller
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Attendance from '../../models/AttendanceModel.js';
import Position from '../../models/PositionModel.js';
import SalaryDeduction from '../../models/SalaryDeductionModel.js';
import Employee from '../../models/EmployeeModel.js';
import { getSalaryReport, getSalarySlip, getEmployeeSalaryHistory } from '../../controllers/SalaryController.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('Salary Controller - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('getSalaryReport', function() {
        it('should return 400 when month or year parameter is missing', async function() {
            const req = createMockReq({ query: {} });
            const res = createMockRes();

            await getSalaryReport(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Month and year parameters are required" })).to.be.true;
        });

        it('should return empty array when no attendance data found', async function() {
            sinon.stub(Attendance, 'findAll').resolves([]);

            const req = createMockReq({ query: { month: 'January', year: '2025' } });
            const res = createMockRes();

            await getSalaryReport(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([])).to.be.true;
        });

        it('should return salary data with correct calculations', async function() {
            const attendanceData = [{
                id: 1,
                month: 'January',
                nik: '001',
                employee_name: 'John Doe',
                gender: 'Male',
                position_name: 'Manager',
                present: 20,
                sick: 2,
                absent: 1
            }];

            const positions = [{
                position_name: 'Manager',
                basic_salary: 5000000,
                transport_allowance: 500000,
                meal_allowance: 300000
            }];

            const deductions = [
                { deduction: 'absent', deduction_amount: 100000 },
                { deduction: 'sick', deduction_amount: 50000 }
            ];

            sinon.stub(Attendance, 'findAll').resolves(attendanceData);
            sinon.stub(Position, 'findAll').resolves(positions);
            sinon.stub(SalaryDeduction, 'findAll').resolves(deductions);

            const req = createMockReq({ query: { month: 'January', year: '2025' } });
            const res = createMockRes();

            await getSalaryReport(req, res);

            expect(res.status.calledWith(200)).to.be.true;

            const result = res.json.firstCall.args[0];
            expect(result).to.be.an('array').with.lengthOf(1);
            expect(result[0].employee_name).to.equal('John Doe');
            expect(result[0].basic_salary).to.equal(5000000);
            expect(result[0].total_deduction).to.equal(200000);
            expect(result[0].gross_salary).to.equal(5800000);
            expect(result[0].net_salary).to.equal(5600000);
        });

        it('should handle server errors gracefully', async function() {
            sinon.stub(Attendance, 'findAll').rejects(new Error('DB connection failed'));

            const req = createMockReq({ query: { month: 'January', year: '2025' } });
            const res = createMockRes();

            await getSalaryReport(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'DB connection failed' })).to.be.true;
        });

        it('should default deduction to 0 when position not found in map', async function() {
            const attendanceData = [{
                id: 1, month: 'January', nik: '002',
                employee_name: 'Jane', gender: 'Female',
                position_name: 'UnknownRole', present: 20, sick: 0, absent: 0
            }];

            sinon.stub(Attendance, 'findAll').resolves(attendanceData);
            sinon.stub(Position, 'findAll').resolves([]);
            sinon.stub(SalaryDeduction, 'findAll').resolves([]);

            const req = createMockReq({ query: { month: 'January', year: '2025' } });
            const res = createMockRes();

            await getSalaryReport(req, res);

            const result = res.json.firstCall.args[0];
            expect(result[0].basic_salary).to.equal(0);
            expect(result[0].net_salary).to.equal(0);
        });
    });

    describe('getSalarySlip', function() {
        it('should return 400 when month or year parameter is missing', async function() {
            const req = createMockReq({ query: {}, params: { id: 1 } });
            const res = createMockRes();

            await getSalarySlip(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Month and year parameters are required" })).to.be.true;
        });

        it('should return 404 when employee is not found', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ query: { month: 'January', year: '2025' }, params: { id: 99 } });
            const res = createMockRes();

            await getSalarySlip(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Employee not found" })).to.be.true;
        });

        it('should return 404 when attendance data is not found', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1, nik: '001', employee_name: 'John', position_name: 'Manager',
                gender: 'Male', status: 'Active', position: null
            });
            sinon.stub(Attendance, 'findOne').resolves(null);

            const req = createMockReq({ query: { month: 'January', year: '2025' }, params: { id: 1 } });
            const res = createMockRes();

            await getSalarySlip(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Attendance data not found for this period" })).to.be.true;
        });

        it('should return salary slip with correct structure', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1, nik: '001', employee_name: 'John Doe',
                gender: 'Male', status: 'Active',
                position: {
                    position_name: 'Manager',
                    basic_salary: 5000000,
                    transport_allowance: 500000,
                    meal_allowance: 300000
                }
            });
            sinon.stub(Attendance, 'findOne').resolves({
                present: 20, sick: 1, absent: 2
            });
            sinon.stub(SalaryDeduction, 'findAll').resolves([
                { deduction: 'absent', deduction_amount: 100000 },
                { deduction: 'sick', deduction_amount: 50000 }
            ]);

            const req = createMockReq({ query: { month: 'January', year: '2025' }, params: { id: 1 } });
            const res = createMockRes();

            await getSalarySlip(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            const result = res.json.firstCall.args[0];
            expect(result).to.have.property('employee');
            expect(result).to.have.property('earnings');
            expect(result).to.have.property('deductions');
            expect(result).to.have.property('net_salary');
            expect(result.earnings.total).to.equal(5800000);
            expect(result.net_salary).to.equal(5550000);
        });
    });

    describe('getEmployeeSalaryHistory', function() {
        it('should return 404 when employee is not found', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ session: { userId: 'uuid-missing' } });
            const res = createMockRes();

            await getEmployeeSalaryHistory(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Employee not found" })).to.be.true;
        });

        it('should return empty array when no attendance records exist', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1, nik: '001', position_name: 'Manager'
            });
            sinon.stub(Attendance, 'findAll').resolves([]);

            const req = createMockReq({ session: { userId: 'uuid-1' } });
            const res = createMockRes();

            await getEmployeeSalaryHistory(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([])).to.be.true;
        });
    });
});
