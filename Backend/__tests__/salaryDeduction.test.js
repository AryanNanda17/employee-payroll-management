/**
 * Structural Testing - SalaryDeduction Controller
 * Framework: Jest + Babel
 * Run: npm test -- --coverage
 */

jest.mock('../models/SalaryDeductionModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

import {
    getDeductions,
    getDeductionById,
    createDeduction,
    updateDeduction,
    deleteDeduction
} from '../controllers/SalaryDeductionController.js';
import SalaryDeduction from '../models/SalaryDeductionModel.js';

const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('SalaryDeduction Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getDeductions', () => {
        it('should return all deductions with status 200', async () => {
            const deductions = [
                { id: 1, deduction: 'Absent', deduction_amount: 50000 },
                { id: 2, deduction: 'Sick', deduction_amount: 25000 }
            ];
            SalaryDeduction.findAll.mockResolvedValue(deductions);

            const req = mockReq();
            const res = mockRes();

            await getDeductions(req, res);

            expect(SalaryDeduction.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'deduction', 'deduction_amount']
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deductions);
        });

        it('should return empty array when no deductions exist', async () => {
            SalaryDeduction.findAll.mockResolvedValue([]);

            const req = mockReq();
            const res = mockRes();

            await getDeductions(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should return 500 on database error', async () => {
            SalaryDeduction.findAll.mockRejectedValue(new Error('Connection refused'));

            const req = mockReq();
            const res = mockRes();

            await getDeductions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Connection refused' });
        });
    });

    describe('getDeductionById', () => {
        it('should return deduction by ID with status 200', async () => {
            const deduction = { id: 1, deduction: 'Absent', deduction_amount: 50000 };
            SalaryDeduction.findOne.mockResolvedValue(deduction);

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await getDeductionById(req, res);

            expect(SalaryDeduction.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(deduction);
        });

        it('should return 404 when deduction not found', async () => {
            SalaryDeduction.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 } });
            const res = mockRes();

            await getDeductionById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Deduction not found" });
        });

        it('should return 500 on database error', async () => {
            SalaryDeduction.findOne.mockRejectedValue(new Error('Query failed'));

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await getDeductionById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Query failed' });
        });
    });

    describe('createDeduction', () => {
        it('should create deduction successfully', async () => {
            SalaryDeduction.create.mockResolvedValue({});

            const req = mockReq({ body: { deduction: 'Late', deduction_amount: 10000 } });
            const res = mockRes();

            await createDeduction(req, res);

            expect(SalaryDeduction.create).toHaveBeenCalledWith({ deduction: 'Late', deduction_amount: 10000 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ msg: "Salary deduction created successfully" });
        });

        it('should return 400 when deduction name is missing', async () => {
            const req = mockReq({ body: { deduction_amount: 10000 } });
            const res = mockRes();

            await createDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Deduction name and amount are required" });
        });

        it('should return 400 when amount is missing', async () => {
            const req = mockReq({ body: { deduction: 'Late' } });
            const res = mockRes();

            await createDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Deduction name and amount are required" });
        });

        it('should accept zero as a valid amount', async () => {
            SalaryDeduction.create.mockResolvedValue({});

            const req = mockReq({ body: { deduction: 'None', deduction_amount: 0 } });
            const res = mockRes();

            await createDeduction(req, res);

            expect(SalaryDeduction.create).toHaveBeenCalledWith({ deduction: 'None', deduction_amount: 0 });
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 500 on database error', async () => {
            SalaryDeduction.create.mockRejectedValue(new Error('Duplicate entry'));

            const req = mockReq({ body: { deduction: 'Late', deduction_amount: 10000 } });
            const res = mockRes();

            await createDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Duplicate entry' });
        });
    });

    describe('updateDeduction', () => {
        it('should update deduction successfully', async () => {
            SalaryDeduction.findOne.mockResolvedValue({ id: 1, deduction: 'Absent', deduction_amount: 50000 });
            SalaryDeduction.update.mockResolvedValue([1]);

            const req = mockReq({
                params: { id: 1 },
                body: { deduction: 'Absent', deduction_amount: 75000 }
            });
            const res = mockRes();

            await updateDeduction(req, res);

            expect(SalaryDeduction.update).toHaveBeenCalledWith(
                { deduction: 'Absent', deduction_amount: 75000 },
                { where: { id: 1 } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Salary deduction updated successfully" });
        });

        it('should return 404 when deduction to update not found', async () => {
            SalaryDeduction.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 }, body: { deduction: 'X', deduction_amount: 0 } });
            const res = mockRes();

            await updateDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Deduction not found" });
        });

        it('should return 500 on database error', async () => {
            SalaryDeduction.findOne.mockResolvedValue({ id: 1 });
            SalaryDeduction.update.mockRejectedValue(new Error('Update failed'));

            const req = mockReq({ params: { id: 1 }, body: { deduction: 'X', deduction_amount: 0 } });
            const res = mockRes();

            await updateDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Update failed' });
        });
    });

    describe('deleteDeduction', () => {
        it('should delete deduction successfully', async () => {
            const destroyMock = jest.fn().mockResolvedValue(1);
            SalaryDeduction.findOne.mockResolvedValue({ id: 1, destroy: destroyMock });

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await deleteDeduction(req, res);

            expect(destroyMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Salary deduction deleted successfully" });
        });

        it('should return 404 when deduction to delete not found', async () => {
            SalaryDeduction.findOne.mockResolvedValue(null);

            const req = mockReq({ params: { id: 999 } });
            const res = mockRes();

            await deleteDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Deduction not found" });
        });

        it('should return 500 on database error during delete', async () => {
            const destroyMock = jest.fn().mockRejectedValue(new Error('FK constraint'));
            SalaryDeduction.findOne.mockResolvedValue({ id: 1, destroy: destroyMock });

            const req = mockReq({ params: { id: 1 } });
            const res = mockRes();

            await deleteDeduction(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'FK constraint' });
        });
    });
});
