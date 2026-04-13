/**
 * Structural Testing - Salary Controller
 * Framework: Jest + Babel
 * Run: npm test -- --coverage
 */

jest.mock('../models/EmployeeModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn()
    }
}));

jest.mock('../models/PositionModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn()
    }
}));

jest.mock('../models/AttendanceModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

jest.mock('../models/SalaryDeductionModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

import { getSalaryReport, getSalarySlip } from '../controllers/SalaryController.js';
import Employee from '../models/EmployeeModel.js';
import Position from '../models/PositionModel.js';
import Attendance from '../models/AttendanceModel.js';
import SalaryDeduction from '../models/SalaryDeductionModel.js';

const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    session: {},
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Salary Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getSalaryReport', () => {
        it('should return 400 when month or year parameter is missing', async () => {
            const req = mockReq({ query: {} });
            const res = mockRes();

            await getSalaryReport(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Month and year parameters are required" });
        });

        it('should return 400 when only month is provided', async () => {
            const req = mockReq({ query: { month: 'March' } });
            const res = mockRes();

            await getSalaryReport(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Month and year parameters are required" });
        });

        it('should return empty array when no attendance data for month', async () => {
            Attendance.findAll.mockResolvedValue([]);

            const req = mockReq({ query: { month: 'March', year: '2024' } });
            const res = mockRes();

            await getSalaryReport(req, res);

            expect(Attendance.findAll).toHaveBeenCalledWith({ where: { month: 'March', year: 2024 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should calculate salary report correctly', async () => {
            const attendanceData = [
                {
                    id: 1, month: 'January', nik: '001',
                    employee_name: 'John', gender: 'Male',
                    position_name: 'Manager', present: 20, sick: 1, absent: 2
                }
            ];
            const positions = [
                { position_name: 'Manager', basic_salary: 5000000, transport_allowance: 500000, meal_allowance: 300000 }
            ];
            const deductions = [
                { deduction: 'Absent', deduction_amount: 100000 },
                { deduction: 'Sick', deduction_amount: 50000 }
            ];

            Attendance.findAll.mockResolvedValue(attendanceData);
            Position.findAll.mockResolvedValue(positions);
            SalaryDeduction.findAll.mockResolvedValue(deductions);

            const req = mockReq({ query: { month: 'January', year: '2024' } });
            const res = mockRes();

            await getSalaryReport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const result = res.json.mock.calls[0][0];
            expect(result).toHaveLength(1);

            const salary = result[0];
            expect(salary.employee_name).toBe('John');
            expect(salary.basic_salary).toBe(5000000);
            expect(salary.transport_allowance).toBe(500000);
            expect(salary.meal_allowance).toBe(300000);
            expect(salary.total_deduction).toBe(2 * 100000 + 1 * 50000);
            expect(salary.gross_salary).toBe(5800000);
            expect(salary.net_salary).toBe(5800000 - 250000);
        });

        it('should use zero when position is not found for an employee', async () => {
            const attendanceData = [
                {
                    id: 1, month: 'January', nik: '001',
                    employee_name: 'Unknown', gender: 'Male',
                    position_name: 'NonExistent', present: 20, sick: 0, absent: 0
                }
            ];

            Attendance.findAll.mockResolvedValue(attendanceData);
            Position.findAll.mockResolvedValue([]);
            SalaryDeduction.findAll.mockResolvedValue([]);

            const req = mockReq({ query: { month: 'January', year: '2024' } });
            const res = mockRes();

            await getSalaryReport(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result[0].basic_salary).toBe(0);
            expect(result[0].transport_allowance).toBe(0);
            expect(result[0].meal_allowance).toBe(0);
            expect(result[0].net_salary).toBe(0);
        });

        it('should handle multiple employees in report', async () => {
            const attendanceData = [
                { id: 1, month: 'Jan', nik: '001', employee_name: 'A', gender: 'Male', position_name: 'Staff', present: 22, sick: 0, absent: 0 },
                { id: 2, month: 'Jan', nik: '002', employee_name: 'B', gender: 'Female', position_name: 'Staff', present: 20, sick: 1, absent: 1 }
            ];
            const positions = [
                { position_name: 'Staff', basic_salary: 3000000, transport_allowance: 200000, meal_allowance: 150000 }
            ];
            const deductions = [
                { deduction: 'absent', deduction_amount: 80000 },
                { deduction: 'sick', deduction_amount: 40000 }
            ];

            Attendance.findAll.mockResolvedValue(attendanceData);
            Position.findAll.mockResolvedValue(positions);
            SalaryDeduction.findAll.mockResolvedValue(deductions);

            const req = mockReq({ query: { month: 'Jan', year: '2024' } });
            const res = mockRes();

            await getSalaryReport(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result).toHaveLength(2);
            expect(result[0].total_deduction).toBe(0);
            expect(result[1].total_deduction).toBe(1 * 80000 + 1 * 40000);
        });

        it('should return 500 on database error', async () => {
            Attendance.findAll.mockRejectedValue(new Error('DB error'));

            const req = mockReq({ query: { month: 'January', year: '2024' } });
            const res = mockRes();

            await getSalaryReport(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
        });
    });

    describe('getSalarySlip', () => {
        it('should return 400 when month or year parameter is missing', async () => {
            const req = mockReq({ query: {}, params: { id: 1 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Month and year parameters are required" });
        });

        it('should return 404 when employee not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ query: { month: 'January', year: '2024' }, params: { id: 999 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee not found" });
        });

        it('should return 404 when attendance not found for period', async () => {
            Employee.findOne.mockResolvedValue({
                id: 1, nik: '001',
                position: { position_name: 'Staff', basic_salary: 3000000, transport_allowance: 200000, meal_allowance: 150000 }
            });
            Attendance.findOne.mockResolvedValue(null);

            const req = mockReq({ query: { month: 'March', year: '2024' }, params: { id: 1 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            expect(Attendance.findOne).toHaveBeenCalledWith({
                where: { nik: '001', month: 'March', year: 2024 }
            });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance data not found for this period" });
        });

        it('should return full salary slip with deduction details', async () => {
            const employee = {
                id: 1, nik: '001', employee_name: 'John',
                gender: 'Male', status: 'Permanent Employee',
                position: { position_name: 'Manager', basic_salary: 5000000, transport_allowance: 500000, meal_allowance: 300000 }
            };
            const attendance = { present: 18, sick: 2, absent: 2 };
            const deductions = [
                { deduction: 'Absent', deduction_amount: 100000 },
                { deduction: 'Sick', deduction_amount: 50000 }
            ];

            Employee.findOne.mockResolvedValue(employee);
            Attendance.findOne.mockResolvedValue(attendance);
            SalaryDeduction.findAll.mockResolvedValue(deductions);

            const req = mockReq({ query: { month: 'January', year: '2024' }, params: { id: 1 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const result = res.json.mock.calls[0][0];

            expect(result.employee.employee_name).toBe('John');
            expect(result.period).toBe('January 2024');

            expect(result.attendance).toEqual({ present: 18, sick: 2, absent: 2 });

            expect(result.earnings.basic_salary).toBe(5000000);
            expect(result.earnings.transport_allowance).toBe(500000);
            expect(result.earnings.meal_allowance).toBe(300000);
            expect(result.earnings.total).toBe(5800000);

            expect(result.deductions.total).toBe(2 * 100000 + 2 * 50000);
            expect(result.deductions.details).toHaveLength(2);
            expect(result.deductions.details[0]).toEqual({
                type: 'Absent', days: 2, rate: 100000, total: 200000
            });
            expect(result.deductions.details[1]).toEqual({
                type: 'Sick Leave', days: 2, rate: 50000, total: 100000
            });

            expect(result.net_salary).toBe(5800000 - 300000);
        });

        it('should handle employee with no position found (zero salary)', async () => {
            const employee = {
                id: 1, nik: '001', employee_name: 'Jane',
                gender: 'Female', status: 'Contract Employee',
                position: null
            };
            const attendance = { present: 22, sick: 0, absent: 0 };

            Employee.findOne.mockResolvedValue(employee);
            Attendance.findOne.mockResolvedValue(attendance);
            SalaryDeduction.findAll.mockResolvedValue([]);

            const req = mockReq({ query: { month: 'February', year: '2024' }, params: { id: 1 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.earnings.basic_salary).toBe(0);
            expect(result.earnings.total).toBe(0);
            expect(result.deductions.total).toBe(0);
            expect(result.deductions.details).toHaveLength(0);
            expect(result.net_salary).toBe(0);
        });

        it('should not include sick deduction detail when sick days are zero', async () => {
            const employee = {
                id: 1, nik: '001', employee_name: 'John',
                gender: 'Male', status: 'Permanent Employee',
                position: { position_name: 'Staff', basic_salary: 3000000, transport_allowance: 200000, meal_allowance: 150000 }
            };
            const attendance = { present: 21, sick: 0, absent: 1 };
            const deductions = [
                { deduction: 'Absent', deduction_amount: 80000 },
                { deduction: 'Sick', deduction_amount: 40000 }
            ];

            Employee.findOne.mockResolvedValue(employee);
            Attendance.findOne.mockResolvedValue(attendance);
            SalaryDeduction.findAll.mockResolvedValue(deductions);

            const req = mockReq({ query: { month: 'January', year: '2024' }, params: { id: 1 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.deductions.details).toHaveLength(1);
            expect(result.deductions.details[0].type).toBe('Absent');
        });

        it('should return 500 on database error', async () => {
            Employee.findOne.mockRejectedValue(new Error('Connection lost'));

            const req = mockReq({ query: { month: 'January', year: '2024' }, params: { id: 1 } });
            const res = mockRes();

            await getSalarySlip(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Connection lost' });
        });
    });
});
