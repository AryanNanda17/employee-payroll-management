/**
 * Functional & Unit Testing - Position Controller
 * Framework: Mocha + Chai + Sinon
 * Run: npm run test:mocha
 */

import chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';

import Position from '../../models/PositionModel.js';
import { getPositions, createPosition, updatePosition, deletePosition } from '../../controllers/PositionController.js';
import { createMockReq, createMockRes } from '../helpers/mocks.mjs';

describe('Position Controller - Functional Tests', function() {
    afterEach(function() {
        sinon.restore();
    });

    describe('getPositions', function() {
        it('should return all positions for admin role', async function() {
            const positions = [
                { id: 1, position_name: 'Manager', basic_salary: 5000000, transport_allowance: 500000, meal_allowance: 300000 },
                { id: 2, position_name: 'Staff', basic_salary: 3000000, transport_allowance: 300000, meal_allowance: 200000 }
            ];
            sinon.stub(Position, 'findAll').resolves(positions);

            const req = createMockReq({ role: 'admin' });
            const res = createMockRes();

            await getPositions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(positions)).to.be.true;
        });

        it('should return 500 on database error', async function() {
            sinon.stub(Position, 'findAll').rejects(new Error('Table not found'));

            const req = createMockReq({ role: 'admin' });
            const res = createMockRes();

            await getPositions(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

        it('should return empty array when no positions exist', async function() {
            sinon.stub(Position, 'findAll').resolves([]);

            const req = createMockReq({ role: 'admin' });
            const res = createMockRes();

            await getPositions(req, res);

            expect(res.json.calledWith([])).to.be.true;
        });
    });

    describe('createPosition', function() {
        it('should create position as admin', async function() {
            sinon.stub(Position, 'create').resolves({});

            const req = createMockReq({
                role: 'admin',
                userId: 1,
                body: {
                    position_name: 'Supervisor',
                    basic_salary: 4000000,
                    transport_allowance: 400000,
                    meal_allowance: 250000
                }
            });
            const res = createMockRes();

            await createPosition(req, res);

            expect(Position.create.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ msg: "Position data created successfully" })).to.be.true;
        });

        it('should return 500 when creation fails', async function() {
            sinon.stub(Position, 'create').rejects(new Error('Validation error'));

            const req = createMockReq({
                role: 'admin',
                body: { position_name: '' }
            });
            const res = createMockRes();

            await createPosition(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });

        it('should include position_uuid when creating position', async function() {
            const createStub = sinon.stub(Position, 'create').resolves({});

            const req = createMockReq({
                role: 'admin',
                userId: 42,
                body: {
                    position_name: 'Director',
                    basic_salary: 8000000,
                    transport_allowance: 800000,
                    meal_allowance: 500000
                }
            });
            const res = createMockRes();

            await createPosition(req, res);

            const createArgs = createStub.firstCall.args[0];
            expect(createArgs.position_uuid).to.be.a('string');
            expect(createArgs.position_name).to.equal('Director');
        });
    });

    describe('updatePosition', function() {
        it('should update position as admin', async function() {
            sinon.stub(Position, 'findOne').resolves({ id: 1 });
            sinon.stub(Position, 'update').resolves([1]);

            const req = createMockReq({
                role: 'admin',
                params: { id: 1 },
                body: {
                    position_name: 'Senior Manager',
                    basic_salary: 6000000,
                    transport_allowance: 600000,
                    meal_allowance: 400000
                }
            });
            const res = createMockRes();

            await updatePosition(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Position data updated successfully" })).to.be.true;
        });

        it('should return 404 when position to update not found', async function() {
            sinon.stub(Position, 'findOne').resolves(null);

            const req = createMockReq({
                role: 'admin',
                params: { id: 999 }
            });
            const res = createMockRes();

            await updatePosition(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Position not found" })).to.be.true;
        });

        it('should return 500 on update error', async function() {
            sinon.stub(Position, 'findOne').resolves({ id: 1 });
            sinon.stub(Position, 'update').rejects(new Error('Update failed'));

            const req = createMockReq({
                role: 'admin',
                params: { id: 1 },
                body: { position_name: 'Updated' }
            });
            const res = createMockRes();

            await updatePosition(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('deletePosition', function() {
        it('should delete position as admin', async function() {
            const mockPosition = {
                id: 1,
                destroy: sinon.stub().resolves()
            };
            sinon.stub(Position, 'findOne').resolves(mockPosition);

            const req = createMockReq({
                role: 'admin',
                params: { id: 1 }
            });
            const res = createMockRes();

            await deletePosition(req, res);

            expect(mockPosition.destroy.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: "Position data deleted successfully" })).to.be.true;
        });

        it('should return 404 when position to delete not found', async function() {
            sinon.stub(Position, 'findOne').resolves(null);

            const req = createMockReq({
                role: 'admin',
                params: { id: 999 }
            });
            const res = createMockRes();

            await deletePosition(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('should return 500 on delete error', async function() {
            const mockPosition = {
                id: 1,
                destroy: sinon.stub().rejects(new Error('Cannot delete'))
            };
            sinon.stub(Position, 'findOne').resolves(mockPosition);

            const req = createMockReq({
                role: 'admin',
                params: { id: 1 }
            });
            const res = createMockRes();

            await deletePosition(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });
});
