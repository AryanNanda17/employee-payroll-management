/**
 * Structural Testing - Auth Middleware
 * Framework: Jest + Babel
 * Run: npm test -- --coverage
 */

jest.mock('../models/EmployeeModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn()
    }
}));

import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import Employee from '../models/EmployeeModel.js';

const mockReq = (overrides = {}) => ({
    session: {},
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe('Auth Middleware - Structural Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('verifyUser', () => {
        it('should return 401 when no session userId', async () => {
            const req = mockReq({ session: {} });
            const res = mockRes();

            await verifyUser(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ msg: "Please log in to your account!" });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should set userId and role on req when user found', async () => {
            const employee = {
                id: 1,
                employee_uuid: 'uuid-123',
                role: 'admin'
            };
            Employee.findOne.mockResolvedValue(employee);

            const req = mockReq({ session: { userId: 'uuid-123' } });
            const res = mockRes();

            await verifyUser(req, res, mockNext);

            expect(req.userId).toBe(1);
            expect(req.role).toBe('admin');
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 404 when user not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ session: { userId: 'nonexistent' } });
            const res = mockRes();

            await verifyUser(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 500 on server error', async () => {
            Employee.findOne.mockRejectedValue(new Error('DB connection lost'));

            const req = mockReq({ session: { userId: 'uuid-123' } });
            const res = mockRes();

            await verifyUser(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: "A server error occurred" });
        });

        it('should handle employee role verification', async () => {
            const employee = {
                id: 5,
                employee_uuid: 'uuid-emp-5',
                role: 'employee'
            };
            Employee.findOne.mockResolvedValue(employee);

            const req = mockReq({ session: { userId: 'uuid-emp-5' } });
            const res = mockRes();

            await verifyUser(req, res, mockNext);

            expect(req.userId).toBe(5);
            expect(req.role).toBe('employee');
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('adminOnly', () => {
        it('should call next when user is admin', async () => {
            Employee.findOne.mockResolvedValue({
                id: 1,
                employee_uuid: 'uuid-admin',
                role: 'admin'
            });

            const req = mockReq({ session: { userId: 'uuid-admin' } });
            const res = mockRes();

            await adminOnly(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 403 when user is not admin', async () => {
            Employee.findOne.mockResolvedValue({
                id: 5,
                employee_uuid: 'uuid-emp',
                role: 'employee'
            });

            const req = mockReq({ session: { userId: 'uuid-emp' } });
            const res = mockRes();

            await adminOnly(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: "Access denied. Admin privileges required." });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 404 when employee not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ session: { userId: 'deleted-user' } });
            const res = mockRes();

            await adminOnly(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee data not found" });
        });

        it('should return 500 on server error', async () => {
            Employee.findOne.mockRejectedValue(new Error('Connection timeout'));

            const req = mockReq({ session: { userId: 'uuid-123' } });
            const res = mockRes();

            await adminOnly(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: "A server error occurred" });
        });
    });
});
