import Employee from "../models/EmployeeModel.js";
import Position from "../models/PositionModel.js";
import Attendance from "../models/AttendanceModel.js";
import SalaryDeduction from "../models/SalaryDeductionModel.js";

export const getSalaryReport = async (req, res) => {
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).json({ msg: "Month and year parameters are required" });
    }

    try {
        const attendanceData = await Attendance.findAll({ where: { month, year: parseInt(year) } });

        if (attendanceData.length === 0) {
            return res.status(200).json([]);
        }

        const positions = await Position.findAll();
        const deductions = await SalaryDeduction.findAll();

        const positionMap = new Map();
        positions.forEach(p => {
            positionMap.set(p.position_name, {
                basic_salary: p.basic_salary,
                transport_allowance: p.transport_allowance,
                meal_allowance: p.meal_allowance
            });
        });

        const deductionMap = new Map();
        deductions.forEach(d => {
            deductionMap.set(d.deduction.toLowerCase(), d.deduction_amount);
        });

        const absentDeduction = deductionMap.get('absent') || deductionMap.get('alpha') || 0;
        const sickDeduction = deductionMap.get('sick') || deductionMap.get('sakit') || 0;

        const salaryData = attendanceData.map(att => {
            const pos = positionMap.get(att.position_name) || {
                basic_salary: 0, transport_allowance: 0, meal_allowance: 0
            };

            const totalDeduction =
                (att.absent * absentDeduction) +
                (att.sick * sickDeduction);

            const grossSalary = pos.basic_salary + pos.transport_allowance + pos.meal_allowance;
            const netSalary = grossSalary - totalDeduction;

            return {
                id: att.id,
                month: att.month,
                nik: att.nik,
                employee_name: att.employee_name,
                gender: att.gender,
                position_name: att.position_name,
                basic_salary: pos.basic_salary,
                transport_allowance: pos.transport_allowance,
                meal_allowance: pos.meal_allowance,
                present: att.present,
                sick: att.sick,
                absent: att.absent,
                total_deduction: totalDeduction,
                gross_salary: grossSalary,
                net_salary: netSalary
            };
        });

        res.status(200).json(salaryData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getSalarySlip = async (req, res) => {
    const { month, year } = req.query;
    const { id } = req.params;

    if (!month || !year) {
        return res.status(400).json({ msg: "Month and year parameters are required" });
    }

    try {
        const employee = await Employee.findOne({
            where: { id },
            include: [{
                model: Position,
                as: 'position',
                attributes: ['position_name', 'basic_salary', 'transport_allowance', 'meal_allowance']
            }]
        });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        const attendance = await Attendance.findOne({
            where: { nik: employee.nik, month, year: parseInt(year) }
        });
        if (!attendance) {
            return res.status(404).json({ msg: "Attendance data not found for this period" });
        }

        const deductions = await SalaryDeduction.findAll();
        const deductionMap = new Map();
        deductions.forEach(d => {
            deductionMap.set(d.deduction.toLowerCase(), d.deduction_amount);
        });

        const absentDeduction = deductionMap.get('absent') || deductionMap.get('alpha') || 0;
        const sickDeduction = deductionMap.get('sick') || deductionMap.get('sakit') || 0;

        const position = employee.position;
        const basic_salary = position ? position.basic_salary : 0;
        const transport_allowance = position ? position.transport_allowance : 0;
        const meal_allowance = position ? position.meal_allowance : 0;

        const totalDeduction =
            (attendance.absent * absentDeduction) +
            (attendance.sick * sickDeduction);

        const grossSalary = basic_salary + transport_allowance + meal_allowance;
        const netSalary = grossSalary - totalDeduction;

        const deductionDetails = [];
        if (attendance.absent > 0) {
            deductionDetails.push({
                type: 'Absent',
                days: attendance.absent,
                rate: absentDeduction,
                total: attendance.absent * absentDeduction
            });
        }
        if (attendance.sick > 0 && sickDeduction > 0) {
            deductionDetails.push({
                type: 'Sick Leave',
                days: attendance.sick,
                rate: sickDeduction,
                total: attendance.sick * sickDeduction
            });
        }

        res.status(200).json({
            employee: {
                id: employee.id,
                nik: employee.nik,
                employee_name: employee.employee_name,
                position_name: position ? position.position_name : '-',
                gender: employee.gender,
                status: employee.status
            },
            period: `${month} ${year}`,
            attendance: {
                present: attendance.present,
                sick: attendance.sick,
                absent: attendance.absent
            },
            earnings: {
                basic_salary,
                transport_allowance,
                meal_allowance,
                total: grossSalary
            },
            deductions: {
                details: deductionDetails,
                total: totalDeduction
            },
            net_salary: netSalary
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getEmployeeSalaryHistory = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { employee_uuid: req.session.userId },
            include: [{
                model: Position,
                as: 'position',
                attributes: ['position_name', 'basic_salary', 'transport_allowance', 'meal_allowance']
            }]
        });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        const attendanceRecords = await Attendance.findAll({
            where: { nik: employee.nik },
            order: [['year', 'DESC'], ['id', 'DESC']]
        });

        if (attendanceRecords.length === 0) {
            return res.status(200).json([]);
        }

        const deductions = await SalaryDeduction.findAll();
        const deductionMap = new Map();
        deductions.forEach(d => {
            deductionMap.set(d.deduction.toLowerCase(), d.deduction_amount);
        });

        const absentDeduction = deductionMap.get('absent') || deductionMap.get('alpha') || 0;
        const sickDeduction = deductionMap.get('sick') || deductionMap.get('sakit') || 0;

        const position = employee.position;
        const basic_salary = position ? position.basic_salary : 0;
        const transport_allowance = position ? position.transport_allowance : 0;
        const meal_allowance = position ? position.meal_allowance : 0;
        const grossSalary = basic_salary + transport_allowance + meal_allowance;

        const salaryHistory = attendanceRecords.map(att => {
            const totalDeduction =
                (att.absent * absentDeduction) +
                (att.sick * sickDeduction);
            const netSalary = grossSalary - totalDeduction;

            return {
                month: att.month,
                year: att.year,
                position_name: position ? position.position_name : att.position_name,
                basic_salary,
                transport_allowance,
                meal_allowance,
                present: att.present,
                sick: att.sick,
                absent: att.absent,
                total_deduction: totalDeduction,
                net_salary: netSalary
            };
        });

        res.status(200).json(salaryHistory);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
