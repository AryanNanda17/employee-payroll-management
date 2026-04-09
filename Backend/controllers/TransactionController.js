import Attendance from "../models/AttendanceModel.js";
import Employee from "../models/EmployeeModel.js";
import Position from "../models/PositionModel.js";

export const getAttendance = async (req, res) => {
    try {
        const { month, year, nik } = req.query;
        const whereClause = {};
        if (month) whereClause.month = month;
        if (year) whereClause.year = parseInt(year);
        if (nik) whereClause.nik = nik;

        const attendanceData = await Attendance.findAll({
            attributes: ['id', 'month', 'year', 'nik', 'employee_name', 'gender', 'position_name', 'present', 'sick', 'absent'],
            where: whereClause,
            order: [['year', 'ASC'], ['id', 'ASC']]
        });
        res.status(200).json(attendanceData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAttendance = async (req, res) => {
    const { month, year, nik, employee_name, gender, position_name, present, sick, absent } = req.body;

    try {
        const employeeRecord = await Employee.findOne({
            where: { employee_name }
        });

        const positionRecord = await Position.findOne({
            where: { position_name }
        });

        const nikRecord = await Employee.findOne({
            where: { nik }
        });

        if (!employeeRecord) {
            return res.status(404).json({ msg: "Employee data not found" });
        }
        if (!positionRecord) {
            return res.status(404).json({ msg: "Position not found" });
        }
        if (!nikRecord) {
            return res.status(404).json({ msg: "NIK data not found" });
        }

        const existingRecord = await Attendance.findOne({
            where: { nik, month, year: parseInt(year) }
        });

        if (existingRecord) {
            return res.status(400).json({ msg: "Attendance record for this employee, month and year already exists" });
        }

        await Attendance.create({
            month,
            year: parseInt(year),
            nik,
            employee_name: employeeRecord.employee_name,
            gender,
            position_name: positionRecord.position_name,
            present,
            sick,
            absent
        });
        res.status(201).json({ msg: "Attendance data added successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const record = await Attendance.findOne({ where: { id: req.params.id } });
        if (!record) {
            return res.status(404).json({ msg: "Attendance record not found" });
        }
        await Attendance.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "Attendance data updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAttendance = async (req, res) => {
    try {
        const record = await Attendance.findOne({ where: { id: req.params.id } });
        if (!record) {
            return res.status(404).json({ msg: "Attendance record not found" });
        }
        await Attendance.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "Attendance data deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getAttendanceAnalytics = async (req, res) => {
    try {
        const { year } = req.query;
        const whereClause = {};
        if (year) whereClause.year = parseInt(year);

        const attendance = await Attendance.findAll({ where: whereClause });

        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        const monthlyTotals = months.map(m => {
            const records = attendance.filter(a => a.month === m);
            return {
                month: m,
                totalPresent: records.reduce((s, r) => s + (r.present || 0), 0),
                totalSick: records.reduce((s, r) => s + (r.sick || 0), 0),
                totalAbsent: records.reduce((s, r) => s + (r.absent || 0), 0),
                employeeCount: records.length
            };
        });

        const totals = {
            totalPresent: attendance.reduce((s, r) => s + (r.present || 0), 0),
            totalSick: attendance.reduce((s, r) => s + (r.sick || 0), 0),
            totalAbsent: attendance.reduce((s, r) => s + (r.absent || 0), 0),
            totalRecords: attendance.length
        };

        const topAbsentees = {};
        attendance.forEach(a => {
            if (!topAbsentees[a.nik]) {
                topAbsentees[a.nik] = { nik: a.nik, employee_name: a.employee_name, totalAbsent: 0, totalSick: 0 };
            }
            topAbsentees[a.nik].totalAbsent += a.absent || 0;
            topAbsentees[a.nik].totalSick += a.sick || 0;
        });
        const topAbsenteesArr = Object.values(topAbsentees)
            .sort((a, b) => (b.totalAbsent + b.totalSick) - (a.totalAbsent + a.totalSick))
            .slice(0, 5);

        const perfectAttendance = Object.values(topAbsentees)
            .filter(e => e.totalAbsent === 0 && e.totalSick === 0);

        const availableYears = [...new Set(
            (await Attendance.findAll({ attributes: ['year'] })).map(a => a.year)
        )].sort();

        res.status(200).json({
            monthlyTotals,
            totals,
            topAbsentees: topAbsenteesArr,
            perfectAttendance,
            availableYears
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
