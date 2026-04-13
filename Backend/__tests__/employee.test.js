/**
 * Structural Testing - Employee Controller
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

jest.mock('fs', () => ({
    __esModule: true,
    default: {
        existsSync: jest.fn(),
        unlinkSync: jest.fn()
    }
}));

import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../controllers/EmployeeController.js';
import Employee from '../models/EmployeeModel.js';
import Position from '../models/PositionModel.js';
import argon2 from 'argon2';
import fs from 'fs';

const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    session: {},
    files: null,
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:5001'),
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Employee Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getEmployees', () => {
        it('should return all employees with status 200', async () => {
            const employees = [
                { id: 1, employee_uuid: 'uuid-1', nik: '001', employee_name: 'John', gender: 'Male', positionId: 1, join_date: '2023-01-01', status: 'active', photo: 'john.jpg', url: 'http://localhost:5001/images/john.jpg', role: 'admin' },
                { id: 2, employee_uuid: 'uuid-2', nik: '002', employee_name: 'Jane', gender: 'Female', positionId: 2, join_date: '2023-02-01', status: 'active', photo: 'jane.jpg', url: 'http://localhost:5001/images/jane.jpg', role: 'employee' }
            ];
            Employee.findAll.mockResolvedValue(employees);

            const req = mockReq();
            const res = mockRes();

            await getEmployees(req, res);

            expect(Employee.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'employee_uuid', 'nik', 'employee_name', 'gender', 'positionId', 'join_date', 'status', 'photo', 'url', 'role'],
                include: [{
                    model: Position,
                    as: 'position',
                    attributes: ['id', 'position_name', 'basic_salary', 'transport_allowance', 'meal_allowance']
                }]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(employees);
        });

        it('should return 500 on database error', async () => {
            Employee.findAll.mockRejectedValue(new Error('Database connection failed'));

            const req = mockReq();
            const res = mockRes();

            await getEmployees(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database connection failed' });
        });

        it('should return empty array when no employees exist', async () => {
            Employee.findAll.mockResolvedValue([]);

            const req = mockReq();
            const res = mockRes();

            await getEmployees(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('getEmployeeById', () => {
        it('should return employee by ID', async () => {
            const employee = { id: 1, nik: '001', employee_name: 'John' };
            Employee.findOne.mockResolvedValue(employee);

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await getEmployeeById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(employee);
        });

        it('should return 404 when employee not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 } });
            const res = mockRes();

            await getEmployeeById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "No employee data found for that ID" });
        });

        it('should return 500 on database error', async () => {
            Employee.findOne.mockRejectedValue(new Error('Query failed'));

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await getEmployeeById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createEmployee', () => {
        it('should return 400 when passwords do not match', async () => {
            const req = mockReq({
                body: {
                    nik: '003', employee_name: 'New Employee',
                    username: 'newuser', password: 'pass123',
                    confirmPassword: 'differentpass',
                    gender: 'Male', positionId: 2,
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: { photo: { name: 'test.jpg', data: Buffer.alloc(100), md5: 'abc123', mv: jest.fn() } }
            });
            const res = mockRes();

            await createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Password and confirm password do not match" });
        });

        it('should return 400 when no file uploaded', async () => {
            const req = mockReq({
                body: {
                    nik: '003', employee_name: 'New Employee',
                    username: 'newuser', password: 'pass123',
                    confirmPassword: 'pass123',
                    gender: 'Male', positionId: 2,
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: null
            });
            const res = mockRes();

            await createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "No File Uploaded" });
        });

        it('should return 422 for invalid image type', async () => {
            const req = mockReq({
                body: {
                    nik: '003', employee_name: 'New Employee',
                    username: 'newuser', password: 'pass123',
                    confirmPassword: 'pass123',
                    gender: 'Male', positionId: 2,
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: {
                    photo: {
                        name: 'test.gif',
                        data: Buffer.alloc(100),
                        md5: 'abc123',
                        mv: jest.fn()
                    }
                }
            });
            const res = mockRes();

            await createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ msg: "Invalid image format. Allowed: png, jpg, jpeg" });
        });

        it('should return 422 when image exceeds 2MB', async () => {
            const req = mockReq({
                body: {
                    nik: '003', employee_name: 'New Employee',
                    username: 'newuser', password: 'pass123',
                    confirmPassword: 'pass123',
                    gender: 'Male', positionId: 2,
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: {
                    photo: {
                        name: 'test.jpg',
                        data: Buffer.alloc(3000000),
                        md5: 'abc123',
                        mv: jest.fn()
                    }
                }
            });
            const res = mockRes();

            await createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ msg: "Image must be less than 2 MB" });
        });

        it('should create employee successfully with valid data', async () => {
            argon2.hash.mockResolvedValue('$argon2hashed');
            Employee.create.mockResolvedValue({});

            const mvMock = jest.fn((path, cb) => cb(null));
            const req = mockReq({
                body: {
                    nik: '003', employee_name: 'New Employee',
                    username: 'newuser', password: 'pass123',
                    confirmPassword: 'pass123',
                    gender: 'Male', positionId: 2,
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: {
                    photo: {
                        name: 'test.jpg',
                        data: Buffer.alloc(100),
                        md5: 'abc123',
                        mv: mvMock
                    }
                }
            });
            const res = mockRes();

            await createEmployee(req, res);
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(mvMock).toHaveBeenCalled();
            expect(argon2.hash).toHaveBeenCalledWith('pass123');
            expect(Employee.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ msg: "Registration successful" });
        });
    });

    describe('updateEmployee', () => {
        const existingEmployee = {
            id: 1,
            nik: '001',
            employee_name: 'John',
            photo: 'old.jpg',
            password: '$argon2oldHash'
        };

        it('should return 404 when employee not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 }, body: {} });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee data not found" });
        });

        it('should update without changing password when password is empty', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);
            Employee.update.mockResolvedValue([1]);

            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John Updated',
                    username: 'john', password: '',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: null
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(argon2.hash).not.toHaveBeenCalled();
            expect(Employee.update).toHaveBeenCalledWith(
                expect.objectContaining({ password: '$argon2oldHash', employee_name: 'John Updated', positionId: 1 }),
                { where: { id: 1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee data updated successfully" });
        });

        it('should return 400 when new passwords do not match', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);

            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John',
                    username: 'john', password: 'newpass1',
                    confirmPassword: 'newpass2',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: null
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Password and confirm password do not match" });
        });

        it('should hash and update when new password is provided and matches', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);
            argon2.hash.mockResolvedValue('$argon2newHash');
            Employee.update.mockResolvedValue([1]);

            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John',
                    username: 'john', password: 'newpass123',
                    confirmPassword: 'newpass123',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: null
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(argon2.hash).toHaveBeenCalledWith('newpass123');
            expect(Employee.update).toHaveBeenCalledWith(
                expect.objectContaining({ password: '$argon2newHash' }),
                { where: { id: 1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should update with new photo and remove old file', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);
            Employee.update.mockResolvedValue([1]);
            fs.existsSync.mockReturnValue(true);

            const mvMock = jest.fn((path, cb) => cb(null));
            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John',
                    username: 'john', password: '',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: {
                    photo: {
                        name: 'new.png',
                        data: Buffer.alloc(100),
                        md5: 'def456',
                        mv: mvMock
                    }
                }
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(fs.existsSync).toHaveBeenCalledWith('./public/images/old.jpg');
            expect(fs.unlinkSync).toHaveBeenCalledWith('./public/images/old.jpg');
            expect(mvMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 422 for invalid image type on update', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);

            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John',
                    username: 'john', password: '',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: {
                    photo: {
                        name: 'bad.bmp',
                        data: Buffer.alloc(100),
                        md5: 'xyz',
                        mv: jest.fn()
                    }
                }
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ msg: "Invalid image format. Allowed: png, jpg, jpeg" });
        });

        it('should return 422 when update image exceeds 2MB', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);

            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John',
                    username: 'john', password: '',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: {
                    photo: {
                        name: 'big.jpg',
                        data: Buffer.alloc(3000000),
                        md5: 'xyz',
                        mv: jest.fn()
                    }
                }
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({ msg: "Image must be less than 2 MB" });
        });

        it('should return 400 on database update error', async () => {
            Employee.findOne.mockResolvedValue(existingEmployee);
            Employee.update.mockRejectedValue(new Error('Update failed'));

            const req = mockReq({
                params: { id: 1 },
                body: {
                    nik: '001', employee_name: 'John',
                    username: 'john', password: '',
                    gender: 'Male', positionId: 1,
                    join_date: '2023-01-01', status: 'active',
                    role: 'admin'
                },
                files: null
            });
            const res = mockRes();

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Update failed' });
        });
    });

    describe('deleteEmployee', () => {
        it('should delete employee successfully', async () => {
            Employee.findOne.mockResolvedValue({ id: 1, employee_name: 'John', photo: 'john.jpg' });
            Employee.destroy.mockResolvedValue(1);
            fs.existsSync.mockReturnValue(false);

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await deleteEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee data deleted successfully" });
        });

        it('should return 404 when employee to delete not found', async () => {
            Employee.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 } });
            const res = mockRes();

            await deleteEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Employee data not found" });
        });

        it('should return 400 on delete error', async () => {
            Employee.findOne.mockResolvedValue({ id: 1, photo: 'john.jpg' });
            fs.existsSync.mockReturnValue(false);
            Employee.destroy.mockRejectedValue(new Error('FK constraint'));

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await deleteEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
