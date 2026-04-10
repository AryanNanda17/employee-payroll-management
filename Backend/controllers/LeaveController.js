import LeaveType from "../models/LeaveTypeModel.js";
import LeaveRequest from "../models/LeaveRequestModel.js";
import Employee from "../models/EmployeeModel.js";
import { Op } from "sequelize";
import db from "../config/Database.js";

export const getLeaveTypes = async (req, res) => {
    try {
        const types = await LeaveType.findAll({ order: [['name', 'ASC']] });
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const applyLeave = async (req, res) => {
    const { leave_type, start_date, end_date, reason } = req.body;
    if (!leave_type || !start_date || !end_date || !reason) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    try {
        const employee = await Employee.findOne({ where: { employee_uuid: req.session.userId } });
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        const start = new Date(start_date);
        const end = new Date(end_date);
        if (end < start) return res.status(400).json({ msg: "End date must be after start date" });

        let days = 0;
        const cur = new Date(start);
        while (cur <= end) {
            const day = cur.getDay();
            if (day !== 0 && day !== 6) days++;
            cur.setDate(cur.getDate() + 1);
        }
        if (days === 0) return res.status(400).json({ msg: "Leave must include at least one working day" });

        const type = await LeaveType.findOne({ where: { name: leave_type } });
        if (!type) return res.status(404).json({ msg: "Invalid leave type" });

        const year = start.getFullYear();
        const usedDays = await LeaveRequest.sum('days', {
            where: {
                employee_id: employee.id,
                leave_type,
                status: { [Op.in]: ['pending', 'approved'] },
                start_date: { [Op.gte]: `${year}-01-01` },
                end_date: { [Op.lte]: `${year}-12-31` }
            }
        }) || 0;

        const remaining = type.days_per_year - usedDays;
        if (days > remaining) {
            return res.status(400).json({
                msg: `Insufficient leave balance. You have ${remaining} ${leave_type} day(s) remaining this year.`
            });
        }

        const overlap = await LeaveRequest.findOne({
            where: {
                employee_id: employee.id,
                status: { [Op.in]: ['pending', 'approved'] },
                [Op.or]: [
                    { start_date: { [Op.between]: [start_date, end_date] } },
                    { end_date: { [Op.between]: [start_date, end_date] } },
                    {
                        start_date: { [Op.lte]: start_date },
                        end_date: { [Op.gte]: end_date }
                    }
                ]
            }
        });
        if (overlap) return res.status(409).json({ msg: "You already have a leave request for overlapping dates" });

        await LeaveRequest.create({
            employee_id: employee.id,
            employee_name: employee.employee_name,
            leave_type,
            start_date,
            end_date,
            days,
            reason
        });

        res.status(201).json({ msg: "Leave request submitted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getMyLeaves = async (req, res) => {
    try {
        const employee = await Employee.findOne({ where: { employee_uuid: req.session.userId } });
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        const leaves = await LeaveRequest.findAll({
            where: { employee_id: employee.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getMyLeaveBalance = async (req, res) => {
    try {
        const employee = await Employee.findOne({ where: { employee_uuid: req.session.userId } });
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        const types = await LeaveType.findAll();
        const year = new Date().getFullYear();

        const balances = await Promise.all(types.map(async (type) => {
            const used = await LeaveRequest.sum('days', {
                where: {
                    employee_id: employee.id,
                    leave_type: type.name,
                    status: { [Op.in]: ['pending', 'approved'] },
                    start_date: { [Op.gte]: `${year}-01-01` },
                    end_date: { [Op.lte]: `${year}-12-31` }
                }
            }) || 0;

            return {
                leave_type: type.name,
                total: type.days_per_year,
                used,
                remaining: type.days_per_year - used
            };
        }));

        res.status(200).json(balances);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getAllLeaveRequests = async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    try {
        const requests = await LeaveRequest.findAll({ where, order: [['createdAt', 'DESC']] });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const reviewLeave = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    if (!['approved', 'rejected'].includes(action)) {
        return res.status(400).json({ msg: "Action must be 'approved' or 'rejected'" });
    }

    try {
        const request = await LeaveRequest.findByPk(id);
        if (!request) return res.status(404).json({ msg: "Leave request not found" });
        if (request.status !== 'pending') {
            return res.status(400).json({ msg: `This request has already been ${request.status}` });
        }

        const admin = await Employee.findOne({ where: { employee_uuid: req.session.userId } });

        await request.update({
            status: action,
            reviewed_by: admin ? admin.employee_name : 'Admin',
            reviewed_at: new Date()
        });

        res.status(200).json({ msg: `Leave request ${action} successfully` });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
