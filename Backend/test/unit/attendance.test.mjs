/**
 * Functional & Unit Testing - Attendance (Transaction) Controller
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Attendance from '../../models/AttendanceModel.js';
import Employee from '../../models/EmployeeModel.js';
import Position from '../../models/PositionModel.js';
import {
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
} from '../../controllers/TransactionController.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('Attendance Controller - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('getAttendance', function() {
        it('should return all attendance records', async function() {
            const records = [
                { id: 1, month: 'January', nik: '001', employee_name: 'John', gender: 'Male', position_name: 'Manager', present: 22, sick: 1, absent: 0 },
                { id: 2, month: 'January', nik: '002', employee_name: 'Jane', gender: 'Female', position_name: 'Staff', present: 20, sick: 2, absent: 1 }
            ];
            sinon.stub(Attendance, 'findAll').resolves(records);

            const req = createMockReq({ query: {} });
            const res = createMockRes();

            await getAttendance(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(records)).to.be.true;
        });

        it('should return empty array when no records exist', async function() {
            sinon.stub(Attendance, 'findAll').resolves([]);

            const req = createMockReq({ query: {} });
            const res = createMockRes();

            await getAttendance(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([])).to.be.true;
        });

        it('should query with correct attributes', async function() {
            const findStub = sinon.stub(Attendance, 'findAll').resolves([]);

            const req = createMockReq({ query: {} });
            const res = createMockRes();

            await getAttendance(req, res);

            const queryArgs = findStub.firstCall.args[0];
            expect(queryArgs.attributes).to.include('month');
            expect(queryArgs.attributes).to.include('present');
            expect(queryArgs.attributes).to.include('sick');
            expect(queryArgs.attributes).to.include('absent');
        });
    });

    describe('createAttendance', function() {
        it('should create attendance record successfully', async function() {
            sinon.stub(Employee, 'findOne')
                .onFirstCall().resolves({ employee_name: 'John Doe' })
                .onSecondCall().resolves({ nik: '001' });
            sinon.stub(Position, 'findOne').resolves({ position_name: 'Manager' });
            sinon.stub(Attendance, 'findOne').resolves(null);
            sinon.stub(Attendance, 'create').resolves({});

            const req = createMockReq({
                body: {
                    month: 'February', nik: '001',
                    employee_name: 'John Doe', gender: 'Male',
                    position_name: 'Manager', present: 22, sick: 0, absent: 0
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(Attendance.create.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ msg: "Attendance data added successfully" })).to.be.true;
        });

        it('should return 404 when employee not found', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);
            sinon.stub(Position, 'findOne').resolves(null);
            sinon.stub(Attendance, 'findOne').resolves(null);

            const req = createMockReq({
                body: {
                    employee_name: 'NonexistentEmployee',
                    position_name: 'Manager', nik: '999'
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Employee data not found" })).to.be.true;
        });

        it('should return 404 when position not found', async function() {
            sinon.stub(Employee, 'findOne').resolves({ employee_name: 'John' });
            sinon.stub(Position, 'findOne').resolves(null);
            sinon.stub(Attendance, 'findOne').resolves(null);

            const req = createMockReq({
                body: {
                    employee_name: 'John',
                    position_name: 'InvalidPosition', nik: '001'
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Position not found" })).to.be.true;
        });

        it('should return 404 when NIK is not found', async function() {
            sinon.stub(Employee, 'findOne')
                .onFirstCall().resolves({ employee_name: 'John' })
                .onSecondCall().resolves(null);
            sinon.stub(Position, 'findOne').resolves({ position_name: 'Manager' });
            sinon.stub(Attendance, 'findOne').resolves(null);

            const req = createMockReq({
                body: {
                    employee_name: 'John',
                    position_name: 'Manager',
                    nik: 'invalid-nik'
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "NIK data not found" })).to.be.true;
        });

        it('should return 400 when employee attendance already exists', async function() {
            sinon.stub(Employee, 'findOne')
                .onFirstCall().resolves({ employee_name: 'John' })
                .onSecondCall().resolves({ nik: '001' });
            sinon.stub(Position, 'findOne').resolves({ position_name: 'Manager' });
            sinon.stub(Attendance, 'findOne').resolves({ id: 1, employee_name: 'John' });

            const req = createMockReq({
                body: {
                    month: 'February', nik: '001',
                    employee_name: 'John', position_name: 'Manager',
                    present: 22, sick: 0, absent: 0
                }
            });
            const res = createMockRes();

            await createAttendance(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Attendance record for this employee, month and year already exists" })).to.be.true;
        });
    });

    describe('updateAttendance', function() {
        it('should update attendance record successfully', async function() {
            sinon.stub(Attendance, 'findOne').resolves({ id: 1 });
            sinon.stub(Attendance, 'update').resolves([1]);

            const req = createMockReq({
                params: { id: 1 },
                body: { present: 23, sick: 0, absent: 0 }
            });
            const res = createMockRes();

            await updateAttendance(req, res);

            expect(Attendance.update.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Attendance data updated successfully" })).to.be.true;
        });

        it('should pass request body and ID correctly to update', async function() {
            sinon.stub(Attendance, 'findOne').resolves({ id: 5 });
            const updateStub = sinon.stub(Attendance, 'update').resolves([1]);

            const body = { present: 18, sick: 3, absent: 2 };
            const req = createMockReq({ params: { id: 5 }, body });
            const res = createMockRes();

            await updateAttendance(req, res);

            expect(updateStub.calledWith(body, { where: { id: 5 } })).to.be.true;
        });
    });

    describe('deleteAttendance', function() {
        it('should delete attendance record successfully', async function() {
            sinon.stub(Attendance, 'findOne').resolves({ id: 1 });
            sinon.stub(Attendance, 'destroy').resolves(1);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteAttendance(req, res);

            expect(Attendance.destroy.calledWith({ where: { id: 1 } })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Attendance data deleted successfully" })).to.be.true;
        });
    });
});
