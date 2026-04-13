/**
 * Structural Testing - Auth Controller
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
        hasMany: jest.fn(),
        belongsTo: jest.fn()
    }
}));

jest.mock('argon2', () => ({
    __esModule: true,
    default: {
        verify: jest.fn(),
        hash: jest.fn()
    }
}));

import { Login, Me, LogOut, changePassword } from '../controllers/Auth.js';
import Employee from '../models/EmployeeModel.js';
import Position from '../models/PositionModel.js';
import argon2 from 'argon2';

const mockReq = (overrides = {}) => ({
    body: {},
    session: {},
    params: {},
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('Login', () => {
        it('should return 404 when employee not found', async () => {
            Employee.findOne.mockResolvedValue(null);
            const req = mockReq({ body: { username: 'nonexistent', password: 'pass123' } });
            const res = mockRes();

            await Login(req, res);

            expect(Employee.findOne).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
        });

        it('should return 400 when password is incorrect', async () => {
            Employee.findOne.mockResolvedValue({
                id: 1,
                employee_uuid: 'uuid-123',
                password: '$argon2hashed',
                employee_name: 'John Doe',
                username: 'john',
                role: 'admin'
            });
            argon2.verify.mockResolvedValue(false);

            const req = mockReq({ body: { username: 'john', password: 'wrongpass' } });
            const res = mockRes();

            await Login(req, res);

            expect(argon2.verify).toHaveBeenCalledWith('$argon2hashed', 'wrongpass');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Wrong password" });
        });

        it('should login successfully and set session', async () => {
            const employee = {
                id: 1,
                employee_uuid: 'uuid-123',
                password: '$argon2hashed',
                employee_name: 'John Doe',
                username: 'john',
                role: 'admin'
            };
            Employee.findOne.mockResolvedValue(employee);
            argon2.verify.mockResolvedValue(true);

            const req = mockReq({
                body: { username: 'john', password: 'correct123' },
                session: {}
            });
            const res = mockRes();

            await Login(req, res);

            expect(req.session.userId).toBe('uuid-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                employee_uuid: 'uuid-123',
                employee_name: 'John Doe',
                username: 'john',
                role: 'admin'
            });
        });

        it('should handle employee role login', async () => {
            const employee = {
                id: 5,
                employee_uuid: 'uuid-emp-5',
                password: '$argon2hashed',
                employee_name: 'Jane Smith',
                username: 'jane',
                role: 'employee'
            };
            Employee.findOne.mockResolvedValue(employee);
            argon2.verify.mockResolvedValue(true);

            const req = mockReq({
                body: { username: 'jane', password: 'pass123' },
                session: {}
            });
            const res = mockRes();

            await Login(req, res);

            expect(req.session.userId).toBe('uuid-emp-5');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                id: 5,
                employee_uuid: 'uuid-emp-5',
                role: 'employee'
            }));
        });

        it('should return 500 on unexpected error', async () => {
            Employee.findOne.mockRejectedValue(new Error('DB connection lost'));

            const req = mockReq({ body: { username: 'john', password: 'pass' } });
            const res = mockRes();

            await Login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'DB connection lost' });
        });
    });

    describe('Me', () => {
        it('should return 401 when session userId is missing', async () => {
            const req = mockReq({ session: {} });
            const res = mockRes();

            await Me(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ msg: "Please log in to your account!" });
        });

        it('should return user data when authenticated', async () => {
            const userData = {
                id: 1,
                employee_uuid: 'uuid-123',
                nik: '001',
                employee_name: 'John Doe',
                username: 'john',
                role: 'admin',
                positionId: 1,
                photo: 'john.jpg',
                url: 'http://localhost:5001/images/john.jpg',
                position: { id: 1, position_name: 'Manager' }
            };
            Employee.findOne.mockResolvedValue(userData);

            const req = mockReq({ session: { userId: 'uuid-123' } });
            const res = mockRes();

            await Me(req, res);

            expect(Employee.findOne).toHaveBeenCalledWith({
                attributes: ['id', 'employee_uuid', 'nik', 'employee_name', 'username', 'role', 'positionId', 'photo', 'url'],
                include: [{
                    model: Position,
                    as: 'position',
                    attributes: ['id', 'position_name']
                }],
                where: { employee_uuid: 'uuid-123' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(userData);
        });

        it('should return 404 when user not found in database', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ session: { userId: 'deleted-uuid' } });
            const res = mockRes();

            await Me(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
        });

        it('should return 500 on database error', async () => {
            Employee.findOne.mockRejectedValue(new Error('Query timeout'));

            const req = mockReq({ session: { userId: 'uuid-123' } });
            const res = mockRes();

            await Me(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Query timeout' });
        });
    });

    describe('LogOut', () => {
        it('should destroy session and return 200', () => {
            const req = mockReq({
                session: { destroy: jest.fn(cb => cb(null)) }
            });
            const res = mockRes();

            LogOut(req, res);

            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "You have been logged out" });
        });

        it('should return 400 when session destroy fails', () => {
            const req = mockReq({
                session: { destroy: jest.fn(cb => cb(new Error('Redis error'))) }
            });
            const res = mockRes();

            LogOut(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Unable to logout" });
        });
    });

    describe('changePassword', () => {
        it('should return 400 when fields are missing', async () => {
            const req = mockReq({ body: { currentPassword: 'old123' }, session: { userId: 'uuid-123' } });
            const res = mockRes();

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "All fields are required" });
        });

        it('should return 400 when new password and confirmation do not match', async () => {
            const req = mockReq({
                body: { currentPassword: 'old123', newPassword: 'new123', confirmNewPassword: 'different' },
                session: { userId: 'uuid-123' }
            });
            const res = mockRes();

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "New password and confirmation do not match" });
        });

        it('should return 400 when new password is shorter than 6 characters', async () => {
            const req = mockReq({
                body: { currentPassword: 'old123', newPassword: 'ab', confirmNewPassword: 'ab' },
                session: { userId: 'uuid-123' }
            });
            const res = mockRes();

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Password must be at least 6 characters" });
        });

        it('should return 404 when user not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({
                body: { currentPassword: 'old123', newPassword: 'newpass1', confirmNewPassword: 'newpass1' },
                session: { userId: 'nonexistent-uuid' }
            });
            const res = mockRes();

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
        });

        it('should return 400 when current password is incorrect', async () => {
            Employee.findOne.mockResolvedValue({ id: 1, employee_uuid: 'uuid-123', password: '$argon2hashed' });
            argon2.verify.mockResolvedValue(false);

            const req = mockReq({
                body: { currentPassword: 'wrongold', newPassword: 'newpass1', confirmNewPassword: 'newpass1' },
                session: { userId: 'uuid-123' }
            });
            const res = mockRes();

            await changePassword(req, res);

            expect(argon2.verify).toHaveBeenCalledWith('$argon2hashed', 'wrongold');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Current password is incorrect" });
        });

        it('should change password successfully', async () => {
            Employee.findOne.mockResolvedValue({ id: 1, employee_uuid: 'uuid-123', password: '$argon2hashed' });
            argon2.verify.mockResolvedValue(true);
            argon2.hash.mockResolvedValue('$argon2newHash');
            Employee.update.mockResolvedValue([1]);

            const req = mockReq({
                body: { currentPassword: 'old123', newPassword: 'newpass1', confirmNewPassword: 'newpass1' },
                session: { userId: 'uuid-123' }
            });
            const res = mockRes();

            await changePassword(req, res);

            expect(argon2.hash).toHaveBeenCalledWith('newpass1');
            expect(Employee.update).toHaveBeenCalledWith(
                { password: '$argon2newHash' },
                { where: { id: 1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Password changed successfully" });
        });

        it('should return 500 on unexpected error', async () => {
            Employee.findOne.mockRejectedValue(new Error('DB error'));

            const req = mockReq({
                body: { currentPassword: 'old123', newPassword: 'newpass1', confirmNewPassword: 'newpass1' },
                session: { userId: 'uuid-123' }
            });
            const res = mockRes();

            await changePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
        });
    });
});
