/**
 * Functional & Unit Testing - Employee Controller
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Employee from '../../models/EmployeeModel.js';
import argon2 from 'argon2';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    deleteEmployee
} from '../../controllers/EmployeeController.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('Employee Controller - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('getEmployees', function() {
        it('should return all employees with 200 status', async function() {
            const employees = [
                { id: 1, nik: '001', employee_name: 'John', gender: 'Male', position_name: 'Manager', join_date: '2023-01-01', status: 'active', photo: 'john.jpg', role: 'admin' },
                { id: 2, nik: '002', employee_name: 'Jane', gender: 'Female', position_name: 'Staff', join_date: '2023-02-01', status: 'active', photo: 'jane.jpg', role: 'employee' }
            ];
            sinon.stub(Employee, 'findAll').resolves(employees);

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(employees)).to.be.true;
        });

        it('should return empty array when no employees exist', async function() {
            sinon.stub(Employee, 'findAll').resolves([]);

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([])).to.be.true;
        });

        it('should return 500 on database error', async function() {
            sinon.stub(Employee, 'findAll').rejects(new Error('Connection refused'));

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

        it('should query with correct attribute list', async function() {
            const findAllStub = sinon.stub(Employee, 'findAll').resolves([]);

            const req = createMockReq();
            const res = createMockRes();

            await getEmployees(req, res);

            const queryArgs = findAllStub.firstCall.args[0];
            expect(queryArgs.attributes).to.include('nik');
            expect(queryArgs.attributes).to.include('employee_name');
            expect(queryArgs.attributes).to.include('role');
            expect(queryArgs.attributes).to.not.include('password');
        });
    });

    describe('getEmployeeById', function() {
        it('should return employee when found', async function() {
            const employee = { id: 1, nik: '001', employee_name: 'John Doe' };
            sinon.stub(Employee, 'findOne').resolves(employee);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await getEmployeeById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(employee)).to.be.true;
        });

        it('should return 404 when employee not found by ID', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ params: { id: 999 } });
            const res = createMockRes();

            await getEmployeeById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "No employee data found for that ID" })).to.be.true;
        });

        it('should return 500 on database error', async function() {
            sinon.stub(Employee, 'findOne').rejects(new Error('Query timeout'));

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await getEmployeeById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('createEmployee', function() {
        it('should return 400 when passwords do not match', async function() {
            const req = createMockReq({
                body: {
                    nik: '003', employee_name: 'New User',
                    username: 'newuser', password: 'pass1',
                    confirmPassword: 'pass2',
                    gender: 'Male', position: 'Staff',
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: { photo: { name: 'test.jpg', data: Buffer.alloc(100), md5: 'abc', mv: sinon.stub() } }
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Password and confirm password do not match" })).to.be.true;
        });

        it('should return 400 when no file is uploaded', async function() {
            const req = createMockReq({
                body: {
                    password: 'pass123', confirmPassword: 'pass123'
                },
                files: null
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "No File Uploaded" })).to.be.true;
        });

        it('should return 422 for invalid image extension', async function() {
            const req = createMockReq({
                body: {
                    password: 'pass123', confirmPassword: 'pass123',
                    nik: '003', employee_name: 'Test',
                    username: 'test', gender: 'Male',
                    position: 'Staff', join_date: '2024-01-01',
                    status: 'active', role: 'employee'
                },
                files: {
                    photo: {
                        name: 'doc.pdf',
                        data: Buffer.alloc(100),
                        md5: 'abc123',
                        mv: sinon.stub()
                    }
                }
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({ msg: "Invalid image format. Allowed: png, jpg, jpeg" })).to.be.true;
        });

        it('should return 422 when image exceeds 2MB limit', async function() {
            const req = createMockReq({
                body: {
                    password: 'pass123', confirmPassword: 'pass123',
                    nik: '003', employee_name: 'Test',
                    username: 'test', gender: 'Male',
                    position: 'Staff', join_date: '2024-01-01',
                    status: 'active', role: 'employee'
                },
                files: {
                    photo: {
                        name: 'large.jpg',
                        data: Buffer.alloc(3000000),
                        md5: 'abc123',
                        mv: sinon.stub()
                    }
                }
            });
            const res = createMockRes();

            await createEmployee(req, res);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({ msg: "Image must be less than 2 MB" })).to.be.true;
        });

        it('should create employee with valid data and file upload', async function() {
            sinon.stub(argon2, 'hash').resolves('$argon2hashed');
            sinon.stub(Employee, 'create').resolves({});

            const mvStub = sinon.stub().callsFake((path, cb) => cb(null));
            const req = createMockReq({
                body: {
                    nik: '003', employee_name: 'New Employee',
                    username: 'newuser', password: 'pass123',
                    confirmPassword: 'pass123',
                    gender: 'Male', position: 'Staff',
                    join_date: '2024-01-01', status: 'active',
                    role: 'employee'
                },
                files: {
                    photo: {
                        name: 'photo.jpg',
                        data: Buffer.alloc(500),
                        md5: 'filehash123',
                        mv: mvStub
                    }
                }
            });
            const res = createMockRes();

            await createEmployee(req, res);
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(mvStub.calledOnce).to.be.true;
            expect(argon2.hash.calledWith('pass123')).to.be.true;
            expect(Employee.create.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
        });
    });

    describe('deleteEmployee', function() {
        it('should delete employee successfully', async function() {
            sinon.stub(Employee, 'findOne').resolves({ id: 1, employee_name: 'John' });
            sinon.stub(Employee, 'destroy').resolves(1);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteEmployee(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Employee data deleted successfully" })).to.be.true;
        });

        it('should return 404 when employee to delete does not exist', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ params: { id: 999 } });
            const res = createMockRes();

            await deleteEmployee(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Employee data not found" })).to.be.true;
        });

        it('should return 400 when delete operation fails', async function() {
            sinon.stub(Employee, 'findOne').resolves({ id: 1 });
            sinon.stub(Employee, 'destroy').rejects(new Error('FK constraint'));

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteEmployee(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });
});
