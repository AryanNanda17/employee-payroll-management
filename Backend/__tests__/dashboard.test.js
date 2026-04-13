/**
 * Structural Testing - Dashboard Controller
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

import { getDashboardStats } from '../controllers/DashboardController.js';
import Employee from '../models/EmployeeModel.js';
import Position from '../models/PositionModel.js';
import Attendance from '../models/AttendanceModel.js';

const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    session: {},
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Dashboard Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getDashboardStats', () => {
        it('should return correct stats with employees, positions, and attendance', async () => {
            const employees = [
                { role: 'admin', gender: 'Male', status: 'Permanent Employee' },
                { role: 'employee', gender: 'Female', status: 'Permanent Employee' },
                { role: 'employee', gender: 'Male', status: 'Contract Employee' },
                { role: 'admin', gender: 'Female', status: 'Contract Employee' }
            ];
            const positions = [
                { id: 1, position_name: 'Manager' },
                { id: 2, position_name: 'Staff' }
            ];
            const currentYear = new Date().getFullYear();
            const attendance = [
                { month: 'January', year: currentYear, present: 20, sick: 1, absent: 0 },
                { month: 'January', year: currentYear, present: 18, sick: 2, absent: 1 },
                { month: 'February', year: currentYear, present: 22, sick: 0, absent: 0 }
            ];

            Employee.findAll.mockResolvedValue(employees);
            Position.findAll.mockResolvedValue(positions);
            Attendance.findAll.mockResolvedValue(attendance);

            const req = mockReq();
            const res = mockRes();

            await getDashboardStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const result = res.json.mock.calls[0][0];

            expect(result.totalEmployees).toBe(4);
            expect(result.totalAdmins).toBe(2);
            expect(result.totalPositions).toBe(2);
            expect(result.totalAttendance).toBe(3);

            expect(result.genderDistribution).toEqual({ male: 2, female: 2 });
            expect(result.statusDistribution).toEqual({ permanent: 2, contract: 2 });

            expect(result.monthlyAttendance['January']).toEqual({
                present: 38, sick: 3, absent: 1, count: 2
            });
            expect(result.monthlyAttendance['February']).toEqual({
                present: 22, sick: 0, absent: 0, count: 1
            });
        });

        it('should return zeros when no data exists', async () => {
            Employee.findAll.mockResolvedValue([]);
            Position.findAll.mockResolvedValue([]);
            Attendance.findAll.mockResolvedValue([]);

            const req = mockReq();
            const res = mockRes();

            await getDashboardStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const result = res.json.mock.calls[0][0];

            expect(result.totalEmployees).toBe(0);
            expect(result.totalAdmins).toBe(0);
            expect(result.totalPositions).toBe(0);
            expect(result.totalAttendance).toBe(0);
            expect(result.genderDistribution).toEqual({ male: 0, female: 0 });
            expect(result.statusDistribution).toEqual({ permanent: 0, contract: 0 });
            expect(result.monthlyAttendance).toEqual({});
        });

        it('should handle all-male permanent employees', async () => {
            const employees = [
                { role: 'employee', gender: 'Male', status: 'Permanent Employee' },
                { role: 'employee', gender: 'Male', status: 'Permanent Employee' }
            ];
            Employee.findAll.mockResolvedValue(employees);
            Position.findAll.mockResolvedValue([]);
            Attendance.findAll.mockResolvedValue([]);

            const req = mockReq();
            const res = mockRes();

            await getDashboardStats(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.genderDistribution).toEqual({ male: 2, female: 0 });
            expect(result.statusDistribution).toEqual({ permanent: 2, contract: 0 });
            expect(result.totalAdmins).toBe(0);
        });

        it('should return 500 on database error', async () => {
            Employee.findAll.mockRejectedValue(new Error('DB timeout'));

            const req = mockReq();
            const res = mockRes();

            await getDashboardStats(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'DB timeout' });
        });
    });
});
