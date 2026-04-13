/**
 * Structural Testing - Position Controller
 * Framework: Jest + Babel
 * Run: npm test -- --coverage
 */

jest.mock('../models/PositionModel.js', () => ({
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

jest.mock('../models/EmployeeModel.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn()
    }
}));

jest.mock('sequelize', () => ({
    Sequelize: jest.fn(),
    Op: { and: Symbol.for('and') }
}));

jest.mock('crypto', () => ({
    randomUUID: jest.fn().mockReturnValue('mock-uuid-1234')
}));

import {
    getPositions,
    createPosition,
    updatePosition,
    deletePosition
} from '../controllers/PositionController.js';
import Position from '../models/PositionModel.js';
import Employee from '../models/EmployeeModel.js';

const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    session: {},
    role: 'admin',
    userId: 1,
    ...overrides
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Position Controller - Structural Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getPositions', () => {
        it('should return all positions for admin', async () => {
            const positions = [
                { id: 1, position_name: 'Manager', basic_salary: 5000000, transport_allowance: 500000, meal_allowance: 300000 },
                { id: 2, position_name: 'Staff', basic_salary: 3000000, transport_allowance: 300000, meal_allowance: 200000 }
            ];
            Position.findAll.mockResolvedValue(positions);

            const req = mockReq({ role: 'admin' });
            const res = mockRes();

            await getPositions(req, res);

            expect(Position.findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(positions);
        });

        it('should return 500 on database error', async () => {
            Position.findAll.mockRejectedValue(new Error('DB error'));

            const req = mockReq({ role: 'admin' });
            const res = mockRes();

            await getPositions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'DB error' });
        });
    });

    describe('createPosition', () => {
        it('should create position as admin', async () => {
            Position.create.mockResolvedValue({});

            const req = mockReq({
                role: 'admin',
                body: {
                    position_name: 'Supervisor',
                    basic_salary: 4000000,
                    transport_allowance: 400000,
                    meal_allowance: 250000
                }
            });
            const res = mockRes();

            await createPosition(req, res);

            expect(Position.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    position_uuid: 'mock-uuid-1234',
                    position_name: 'Supervisor',
                    basic_salary: 4000000,
                    transport_allowance: 400000,
                    meal_allowance: 250000
                })
            );
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 500 on creation error', async () => {
            Position.create.mockRejectedValue(new Error('Validation error'));

            const req = mockReq({
                role: 'admin',
                body: { position_name: '' }
            });
            const res = mockRes();

            await createPosition(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updatePosition', () => {
        it('should update position as admin', async () => {
            Position.findOne.mockResolvedValue({ id: 1, position_uuid: 'jab-001' });
            Position.update.mockResolvedValue([1]);

            const req = mockReq({
                role: 'admin',
                params: { id: 1 },
                body: {
                    position_name: 'Senior Manager',
                    basic_salary: 6000000,
                    transport_allowance: 600000,
                    meal_allowance: 350000
                }
            });
            const res = mockRes();

            await updatePosition(req, res);

            expect(Position.update).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Position data updated successfully" });
        });

        it('should return 404 when position not found', async () => {
            Position.findOne.mockResolvedValue(null);

            const req = mockReq({
                role: 'admin',
                params: { id: 999 }
            });
            const res = mockRes();

            await updatePosition(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Position not found" });
        });

        it('should return 500 on update error', async () => {
            Position.findOne.mockResolvedValue({ id: 1 });
            Position.update.mockRejectedValue(new Error('Update failed'));

            const req = mockReq({
                role: 'admin',
                params: { id: 1 },
                body: { position_name: 'Updated' }
            });
            const res = mockRes();

            await updatePosition(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deletePosition', () => {
        it('should delete position as admin', async () => {
            const mockPosition = {
                id: 1,
                position_uuid: 'jab-001',
                destroy: jest.fn().mockResolvedValue(1)
            };
            Position.findOne.mockResolvedValue(mockPosition);

            const req = mockReq({
                role: 'admin',
                params: { id: 1 }
            });
            const res = mockRes();

            await deletePosition(req, res);

            expect(mockPosition.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Position data deleted successfully" });
        });

        it('should return 404 when position not found', async () => {
            Position.findOne.mockResolvedValue(null);

            const req = mockReq({
                role: 'admin',
                params: { id: 999 }
            });
            const res = mockRes();

            await deletePosition(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Position not found" });
        });

        it('should return 500 on delete error', async () => {
            const mockPosition = {
                id: 1,
                destroy: jest.fn().mockRejectedValue(new Error('FK constraint'))
            };
            Position.findOne.mockResolvedValue(mockPosition);

            const req = mockReq({
                role: 'admin',
                params: { id: 1 }
            });
            const res = mockRes();

            await deletePosition(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
