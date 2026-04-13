/**
 * Functional & Unit Testing - Auth Controller
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Employee from '../../models/EmployeeModel.js';
import argon2 from 'argon2';
import { Login, Me, LogOut } from '../../controllers/Auth.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('Auth Controller - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('Login', function() {
        it('should return 404 when employee username is not found', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ body: { username: 'unknown', password: 'pass123' } });
            const res = createMockRes();

            await Login(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "User not found" })).to.be.true;
        });

        it('should return 400 when password does not match', async function() {
            sinon.stub(Employee, 'findOne').resolves({
                id: 1,
                employee_uuid: 'uuid-1',
                password: '$argon2hash',
                employee_name: 'John',
                username: 'john',
                role: 'admin'
            });
            sinon.stub(argon2, 'verify').resolves(false);

            const req = createMockReq({ body: { username: 'john', password: 'wrongpass' } });
            const res = createMockRes();

            await Login(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Wrong password" })).to.be.true;
        });

        it('should login successfully and set session userId', async function() {
            const employee = {
                id: 1,
                employee_uuid: 'uuid-1',
                password: '$argon2hash',
                employee_name: 'John Doe',
                username: 'john',
                role: 'admin'
            };
            sinon.stub(Employee, 'findOne').resolves(employee);
            sinon.stub(argon2, 'verify').resolves(true);

            const session = {};
            const req = createMockReq({
                body: { username: 'john', password: 'correct123' },
                session: session
            });
            const res = createMockRes();

            await Login(req, res);

            expect(session.userId).to.equal('uuid-1');
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            const responseData = res.json.firstCall.args[0];
            expect(responseData.employee_name).to.equal('John Doe');
            expect(responseData.role).to.equal('admin');
        });

        it('should verify argon2 is called with correct arguments', async function() {
            const employee = {
                id: 1, employee_uuid: 'uuid-1',
                password: 'stored_hash',
                employee_name: 'Test', username: 'test', role: 'employee'
            };
            sinon.stub(Employee, 'findOne').resolves(employee);
            const verifyStub = sinon.stub(argon2, 'verify').resolves(true);

            const req = createMockReq({
                body: { username: 'test', password: 'mypassword' },
                session: {}
            });
            const res = createMockRes();

            await Login(req, res);

            expect(verifyStub.calledWith('stored_hash', 'mypassword')).to.be.true;
        });
    });

    describe('Me', function() {
        it('should return 401 when session has no userId', async function() {
            const req = createMockReq({ session: {} });
            const res = createMockRes();

            await Me(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ msg: "Please log in to your account!" })).to.be.true;
        });

        it('should return user data when session is valid', async function() {
            const user = { id: 1, employee_name: 'John', username: 'john', role: 'admin' };
            sinon.stub(Employee, 'findOne').resolves(user);

            const req = createMockReq({ session: { userId: 'uuid-1' } });
            const res = createMockRes();

            await Me(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(user)).to.be.true;
        });

        it('should return 404 when session userId does not match any employee', async function() {
            sinon.stub(Employee, 'findOne').resolves(null);

            const req = createMockReq({ session: { userId: 'deleted-uuid' } });
            const res = createMockRes();

            await Me(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "User not found" })).to.be.true;
        });

        it('should query database with correct attributes', async function() {
            const findStub = sinon.stub(Employee, 'findOne').resolves({ id: 1 });

            const req = createMockReq({ session: { userId: 'uuid-1' } });
            const res = createMockRes();

            await Me(req, res);

            const queryArgs = findStub.firstCall.args[0];
            expect(queryArgs.attributes).to.include('employee_name');
            expect(queryArgs.attributes).to.include('role');
            expect(queryArgs.where.employee_uuid).to.equal('uuid-1');
        });
    });

    describe('LogOut', function() {
        it('should destroy session and return success message', function() {
            const req = createMockReq({
                session: { destroy: sinon.stub().callsFake(cb => cb(null)) }
            });
            const res = createMockRes();

            LogOut(req, res);

            expect(req.session.destroy.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "You have been logged out" })).to.be.true;
        });

        it('should return 400 when session destroy encounters error', function() {
            const req = createMockReq({
                session: { destroy: sinon.stub().callsFake(cb => cb(new Error('Destroy error'))) }
            });
            const res = createMockRes();

            LogOut(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Unable to logout" })).to.be.true;
        });
    });
});
