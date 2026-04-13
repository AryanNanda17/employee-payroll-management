/**
 * Functional & Unit Testing - Salary Deduction Controller
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import SalaryDeduction from '../../models/SalaryDeductionModel.js';
import {
    getDeductions,
    getDeductionById,
    createDeduction,
    updateDeduction,
    deleteDeduction
} from '../../controllers/SalaryDeductionController.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('SalaryDeduction Controller - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('getDeductions', function() {
        it('should return all deductions', async function() {
            const mockDeductions = [
                { id: 1, deduction: 'absent', deduction_amount: 100000 },
                { id: 2, deduction: 'sick', deduction_amount: 50000 }
            ];
            sinon.stub(SalaryDeduction, 'findAll').resolves(mockDeductions);

            const req = createMockReq();
            const res = createMockRes();

            await getDeductions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(mockDeductions)).to.be.true;
        });

        it('should return 500 when database error occurs', async function() {
            sinon.stub(SalaryDeduction, 'findAll').rejects(new Error('DB error'));

            const req = createMockReq();
            const res = createMockRes();

            await getDeductions(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'DB error' })).to.be.true;
        });
    });

    describe('getDeductionById', function() {
        it('should return a deduction by id', async function() {
            const mockDeduction = { id: 1, deduction: 'absent', deduction_amount: 100000 };
            sinon.stub(SalaryDeduction, 'findOne').resolves(mockDeduction);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await getDeductionById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(mockDeduction)).to.be.true;
        });

        it('should return 404 when deduction is not found', async function() {
            sinon.stub(SalaryDeduction, 'findOne').resolves(null);

            const req = createMockReq({ params: { id: 999 } });
            const res = createMockRes();

            await getDeductionById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Deduction not found" })).to.be.true;
        });
    });

    describe('createDeduction', function() {
        it('should return 400 when deduction name is missing', async function() {
            const req = createMockReq({ body: { deduction_amount: 100000 } });
            const res = createMockRes();

            await createDeduction(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Deduction name and amount are required" })).to.be.true;
        });

        it('should return 400 when amount is missing', async function() {
            const req = createMockReq({ body: { deduction: 'absent' } });
            const res = createMockRes();

            await createDeduction(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: "Deduction name and amount are required" })).to.be.true;
        });

        it('should create deduction successfully', async function() {
            sinon.stub(SalaryDeduction, 'create').resolves({});

            const req = createMockReq({ body: { deduction: 'absent', deduction_amount: 100000 } });
            const res = createMockRes();

            await createDeduction(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ msg: "Salary deduction created successfully" })).to.be.true;
        });

        it('should return 500 when database error occurs on create', async function() {
            sinon.stub(SalaryDeduction, 'create').rejects(new Error('Insert failed'));

            const req = createMockReq({ body: { deduction: 'absent', deduction_amount: 100000 } });
            const res = createMockRes();

            await createDeduction(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'Insert failed' })).to.be.true;
        });
    });

    describe('updateDeduction', function() {
        it('should return 404 when deduction to update is not found', async function() {
            sinon.stub(SalaryDeduction, 'findOne').resolves(null);

            const req = createMockReq({
                params: { id: 999 },
                body: { deduction: 'absent', deduction_amount: 150000 }
            });
            const res = createMockRes();

            await updateDeduction(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Deduction not found" })).to.be.true;
        });

        it('should update deduction successfully', async function() {
            sinon.stub(SalaryDeduction, 'findOne').resolves({ id: 1 });
            sinon.stub(SalaryDeduction, 'update').resolves([1]);

            const req = createMockReq({
                params: { id: 1 },
                body: { deduction: 'absent', deduction_amount: 150000 }
            });
            const res = createMockRes();

            await updateDeduction(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Salary deduction updated successfully" })).to.be.true;
        });
    });

    describe('deleteDeduction', function() {
        it('should return 404 when deduction to delete does not exist', async function() {
            sinon.stub(SalaryDeduction, 'findOne').resolves(null);

            const req = createMockReq({ params: { id: 999 } });
            const res = createMockRes();

            await deleteDeduction(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Deduction not found" })).to.be.true;
        });

        it('should delete deduction successfully', async function() {
            const mockDeduction = { id: 1, destroy: sinon.stub().resolves() };
            sinon.stub(SalaryDeduction, 'findOne').resolves(mockDeduction);

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteDeduction(req, res);

            expect(mockDeduction.destroy.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Salary deduction deleted successfully" })).to.be.true;
        });

        it('should return 500 when database error occurs on delete', async function() {
            sinon.stub(SalaryDeduction, 'findOne').rejects(new Error('Delete failed'));

            const req = createMockReq({ params: { id: 1 } });
            const res = createMockRes();

            await deleteDeduction(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'Delete failed' })).to.be.true;
        });
    });
});
