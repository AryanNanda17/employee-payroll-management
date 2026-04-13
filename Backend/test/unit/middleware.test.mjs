/**
 * Functional & Unit Testing - Auth Middleware
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Employee from '../../models/EmployeeModel.js';
import { verifyUser, adminOnly } from '../../middleware/AuthUser.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('Auth Middleware - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('verifyUser', function() {
        it('should return 401 when no session userId exists', async function() {
            const req = createMockReq({ session: {} });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ msg: "Please log in to your account!" })).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should set req.userId and req.role when user is found', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1,
                employee_uuid: 'uuid-123',
                role: 'admin'
            });

            const req = createMockReq({ session: { userId: 'uuid-123' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(req.userId).to.equal(1);
            expect(req.role).to.equal('admin');
            expect(next.calledOnce).to.be.true;
        });

        it('should return 404 when user not found in database', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ session: { userId: 'nonexistent-uuid' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "User not found" })).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 500 on database error', async function() {
            sinon.stub(Employee, 'findOne').rejects(new Error('Connection lost'));

            const req = createMockReq({ session: { userId: 'uuid-123' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: "A server error occurred" })).to.be.true;
        });

        it('should handle employee (non-admin) role', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 5,
                employee_uuid: 'uuid-emp',
                role: 'employee'
            });

            const req = createMockReq({ session: { userId: 'uuid-emp' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            expect(req.role).to.equal('employee');
            expect(next.calledOnce).to.be.true;
        });

        it('should query with correct where clause', async function() {
            const findStub = sinon.stub(Employee, 'findOne').resolves({
                id: 1, role: 'admin'
            });

            const req = createMockReq({ session: { userId: 'test-uuid' } });
            const res = createMockRes();
            const next = sinon.spy();

            await verifyUser(req, res, next);

            const queryArgs = findStub.firstCall.args[0];
            expect(queryArgs.where.employee_uuid).to.equal('test-uuid');
        });
    });

    describe('adminOnly', function() {
        it('should call next() when user is admin', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1,
                employee_uuid: 'uuid-admin',
                role: 'admin'
            });

            const req = createMockReq({ session: { userId: 'uuid-admin' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return 403 when user is not admin', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 5,
                employee_uuid: 'uuid-emp',
                role: 'employee'
            });

            const req = createMockReq({ session: { userId: 'uuid-emp' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWith({ msg: "Access denied. Admin privileges required." })).to.be.true;
            expect(next.called).to.be.false;
        });

        it('should return 404 when employee not found', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ session: { userId: 'deleted-user' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Employee data not found" })).to.be.true;
        });

        it('should return 500 on server error', async function() {
            sinon.stub(Employee, 'findOne').rejects(new Error('Timeout'));

            const req = createMockReq({ session: { userId: 'uuid-123' } });
            const res = createMockRes();
            const next = sinon.spy();

            await adminOnly(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: "A server error occurred" })).to.be.true;
        });
    });
});
