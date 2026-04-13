/**
 * Structural Testing - Attendance (Transaction) Controller
 * Framework: Jest + Babel
 * Run: npm test -- --coverage
 */

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

jest.mock('../models/EmployeeModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn()
    }
}));

jest.mock('../models/PositionModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        belongsTo: jest.fn(),
        hasMany: jest.fn()
    }
}));

import {
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceAnalytics
} from '../controllers/TransactionController.js';
import Attendance from '../models/AttendanceModel.js';
import Employee from '../models/EmployeeModel.js';
import Position from '../models/PositionModel.js';

const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Attendance Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getAttendance', () => {
        it('should return attendance data filtered by month and year', async () => {
            const attendanceData = [
                { id: 1, month: 'January', year: 2025, nik: '001', employee_name: 'John', gender: 'Male', position_name: 'Manager', present: 22, sick: 1, absent: 0 },
            ];
            Attendance.findAll.mockResolvedValue(attendanceData);

            const req = mockReq({ query: { month: 'January', year: '2025' } });
            const res = mockRes();

            await getAttendance(req, res);

            expect(Attendance.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'month', 'year', 'nik', 'employee_name', 'gender', 'position_name', 'present', 'sick', 'absent'],
                where: { month: 'January', year: 2025 },
                order: [['year', 'ASC'], ['id', 'ASC']]
            });
            expect(res.json).toHaveBeenCalledWith(attendanceData);
        });

        it('should return all data when no filters provided', async () => {
            Attendance.findAll.mockResolvedValue([]);

            const req = mockReq({ query: {} });
            const res = mockRes();

            await getAttendance(req, res);

            expect(Attendance.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'month', 'year', 'nik', 'employee_name', 'gender', 'position_name', 'present', 'sick', 'absent'],
                where: {},
                order: [['year', 'ASC'], ['id', 'ASC']]
            });
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should handle server error', async () => {
            Attendance.findAll.mockRejectedValue(new Error('DB error'));

            const req = mockReq({ query: {} });
            const res = mockRes();

            await getAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createAttendance', () => {
        it('should create attendance data successfully', async () => {
            Employee.findOne
                .mockResolvedValueOnce({ employee_name: 'John Doe' })
                .mockResolvedValueOnce({ nik: '001' });
            Position.findOne.mockResolvedValue({ position_name: 'Manager' });
            Attendance.findOne.mockResolvedValue(null);
            Attendance.create.mockResolvedValue({});

            const req = mockReq({
                body: {
                    month: 'February',
                    year: '2025',
                    nik: '001',
                    employee_name: 'John Doe',
                    gender: 'Male',
                    position_name: 'Manager',
                    present: 22,
                    sick: 0,
                    absent: 0
                }
            });
            const res = mockRes();

            await createAttendance(req, res);

            expect(Attendance.create).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance data added successfully" });
        });

        it('should return 404 when employee not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({
                body: {
                    month: 'February',
                    year: '2025',
                    nik: '999',
                    employee_name: 'Nonexistent',
                    position_name: 'Manager'
                }
            });
            const res = mockRes();

            await createAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee data not found" });
        });

        it('should return 404 when position not found', async () => {
            Employee.findOne.mockResolvedValue({ employee_name: 'John' });
            Position.findOne.mockResolvedValue(null);

            const req = mockReq({
                body: {
                    month: 'February',
                    year: '2025',
                    nik: '001',
                    employee_name: 'John',
                    position_name: 'InvalidPosition'
                }
            });
            const res = mockRes();

            await createAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Position not found" });
        });

        it('should return 404 when NIK not found', async () => {
            Employee.findOne
                .mockResolvedValueOnce({ employee_name: 'John' })
                .mockResolvedValueOnce(null);
            Position.findOne.mockResolvedValue({ position_name: 'Manager' });

            const req = mockReq({
                body: {
                    month: 'February',
                    year: '2025',
                    nik: 'invalid-nik',
                    employee_name: 'John',
                    position_name: 'Manager'
                }
            });
            const res = mockRes();

            await createAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "NIK data not found" });
        });

        it('should return 400 when employee attendance already exists for month+year', async () => {
            Employee.findOne
                .mockResolvedValueOnce({ employee_name: 'John' })
                .mockResolvedValueOnce({ nik: '001' });
            Position.findOne.mockResolvedValue({ position_name: 'Manager' });
            Attendance.findOne.mockResolvedValue({ id: 1, nik: '001', month: 'February', year: 2025 });

            const req = mockReq({
                body: {
                    month: 'February',
                    year: '2025',
                    nik: '001',
                    employee_name: 'John',
                    position_name: 'Manager',
                    present: 22, sick: 0, absent: 0
                }
            });
            const res = mockRes();

            await createAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance record for this employee, month and year already exists" });
        });
    });

    describe('updateAttendance', () => {
        it('should update attendance data successfully', async () => {
            Attendance.findOne.mockResolvedValue({ id: 1 });
            Attendance.update.mockResolvedValue([1]);

            const req = mockReq({
                params: { id: 1 },
                body: { present: 23, sick: 0, absent: 0 }
            });
            const res = mockRes();

            await updateAttendance(req, res);

            expect(Attendance.update).toHaveBeenCalledWith(
                { present: 23, sick: 0, absent: 0 },
                { where: { id: 1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance data updated successfully" });
        });

        it('should return 404 when record not found', async () => {
            Attendance.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 } });
            const res = mockRes();

            await updateAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance record not found" });
        });
    });

    describe('deleteAttendance', () => {
        it('should delete attendance data successfully', async () => {
            Attendance.findOne.mockResolvedValue({ id: 1 });
            Attendance.destroy.mockResolvedValue(1);

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await deleteAttendance(req, res);

            expect(Attendance.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance data deleted successfully" });
        });

        it('should return 404 when record not found', async () => {
            Attendance.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 } });
            const res = mockRes();

            await deleteAttendance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Attendance record not found" });
        });
    });

    describe('getAttendanceAnalytics', () => {
        it('should return analytics for a specific year', async () => {
            const mockAttendance = [
                { month: 'January', year: 2025, nik: '001', employee_name: 'John', present: 22, sick: 0, absent: 0 },
                { month: 'January', year: 2025, nik: '002', employee_name: 'Jane', present: 20, sick: 1, absent: 1 },
            ];
            Attendance.findAll
                .mockResolvedValueOnce(mockAttendance)
                .mockResolvedValueOnce([{ year: 2024 }, { year: 2025 }]);

            const req = mockReq({ query: { year: '2025' } });
            const res = mockRes();

            await getAttendanceAnalytics(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const result = res.json.mock.calls[0][0];
            expect(result).toHaveProperty('monthlyTotals');
            expect(result).toHaveProperty('totals');
            expect(result).toHaveProperty('topAbsentees');
            expect(result).toHaveProperty('perfectAttendance');
            expect(result).toHaveProperty('availableYears');
            expect(result.totals.totalPresent).toBe(42);
        });

        it('should handle server error', async () => {
            Attendance.findAll.mockRejectedValue(new Error('DB error'));

            const req = mockReq({ query: { year: '2025' } });
            const res = mockRes();

            await getAttendanceAnalytics(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
