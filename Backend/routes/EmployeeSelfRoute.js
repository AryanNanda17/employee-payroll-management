import express from 'express';
import Employee from '../models/EmployeeModel.js';
import Position from '../models/PositionModel.js';
import Attendance from '../models/AttendanceModel.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/my/profile', verifyUser, async (req, res) => {
    try {
        const employee = await Employee.findOne({
            attributes: ['id', 'employee_uuid', 'nik', 'employee_name', 'username', 'gender', 'positionId', 'join_date', 'status', 'photo', 'url', 'role'],
            include: [{
                model: Position,
                as: 'position',
                attributes: ['id', 'position_name', 'basic_salary', 'transport_allowance', 'meal_allowance']
            }],
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "Profile not found" });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get('/my/attendance', verifyUser, async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        const attendance = await Attendance.findAll({
            where: { nik: employee.nik },
            attributes: ['id', 'month', 'year', 'nik', 'employee_name', 'gender', 'position_name', 'present', 'sick', 'absent'],
            order: [['year', 'DESC'], ['id', 'DESC']]
        });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

export default router;
