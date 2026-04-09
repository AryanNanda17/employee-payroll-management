import Payroll from "../models/PayrollModel.js";
import Employee from "../models/EmployeeModel.js";
import Position from "../models/PositionModel.js";
import Attendance from "../models/AttendanceModel.js";
import SalaryDeduction from "../models/SalaryDeductionModel.js";
import { Op } from "sequelize";

export const processPayroll = async (req, res) => {
    const { month, year } = req.body;
    if (!month || !year) {
        return res.status(400).json({ msg: "Month and year are required" });
    }

    try {
        const existing = await Payroll.findOne({ where: { month, year: parseInt(year) } });
        if (existing) {
            return res.status(409).json({ msg: `Payroll for ${month} ${year} has already been processed` });
        }

        const attendanceData = await Attendance.findAll({ where: { month, year: parseInt(year) } });
        if (attendanceData.length === 0) {
            return res.status(404).json({ msg: `No attendance data found for ${month} ${year}` });
        }

        const positions = await Position.findAll();
        const deductions = await SalaryDeduction.findAll();
        const employees = await Employee.findAll();

        const positionMap = new Map();
        positions.forEach(p => {
            positionMap.set(p.position_name, {
                basic_salary: p.basic_salary,
                transport_allowance: p.transport_allowance,
                meal_allowance: p.meal_allowance
            });
        });

        const employeeMap = new Map();
        employees.forEach(e => { employeeMap.set(e.nik, e.id); });

        const deductionMap = new Map();
        deductions.forEach(d => { deductionMap.set(d.deduction.toLowerCase(), d.deduction_amount); });

        const absentRate = deductionMap.get('absent') || 0;
        const sickRate = deductionMap.get('sick') || 0;

        const adminEmployee = await Employee.findOne({ where: { employee_uuid: req.session.userId } });
        const processedBy = adminEmployee ? adminEmployee.employee_name : 'Admin';

        const payrollRecords = attendanceData.map(att => {
            const pos = positionMap.get(att.position_name) || { basic_salary: 0, transport_allowance: 0, meal_allowance: 0 };
            const grossSalary = pos.basic_salary + pos.transport_allowance + pos.meal_allowance;
            const absentDeduction = att.absent * absentRate;
            const sickDeduction = att.sick * sickRate;
            const totalDeduction = absentDeduction + sickDeduction;
            const netSalary = grossSalary - totalDeduction;

            return {
                employee_id: employeeMap.get(att.nik) || 0,
                nik: att.nik,
                employee_name: att.employee_name,
                position_name: att.position_name,
                month,
                year: parseInt(year),
                basic_salary: pos.basic_salary,
                transport_allowance: pos.transport_allowance,
                meal_allowance: pos.meal_allowance,
                gross_salary: grossSalary,
                present_days: att.present,
                sick_days: att.sick,
                absent_days: att.absent,
                absent_deduction: absentDeduction,
                sick_deduction: sickDeduction,
                total_deduction: totalDeduction,
                net_salary: netSalary,
                status: 'processed',
                processed_by: processedBy
            };
        });

        await Payroll.bulkCreate(payrollRecords);

        res.status(201).json({
            msg: `Payroll processed successfully for ${month} ${year}`,
            count: payrollRecords.length
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPayrollRecords = async (req, res) => {
    const { month, year } = req.query;
    const where = {};
    if (month) where.month = month;
    if (year) where.year = parseInt(year);

    try {
        const records = await Payroll.findAll({ where, order: [['employee_name', 'ASC']] });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPayrollStatus = async (req, res) => {
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).json({ msg: "Month and year are required" });
    }
    try {
        const count = await Payroll.count({ where: { month, year: parseInt(year) } });
        res.status(200).json({ processed: count > 0, count });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProcessedMonths = async (req, res) => {
    try {
        const records = await Payroll.findAll({
            attributes: ['month', 'year'],
            group: ['month', 'year'],
            order: [['year', 'DESC'], ['month', 'ASC']]
        });
        const months = records.map(r => ({ month: r.month, year: r.year }));
        res.status(200).json(months);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const markAsPaid = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ msg: "Please provide payroll record IDs" });
    }
    try {
        await Payroll.update({ status: 'paid' }, { where: { id: { [Op.in]: ids } } });
        res.status(200).json({ msg: `${ids.length} record(s) marked as paid` });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getMyPayrollHistory = async (req, res) => {
    try {
        const employee = await Employee.findOne({ where: { employee_uuid: req.session.userId } });
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        const records = await Payroll.findAll({
            where: { nik: employee.nik },
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
