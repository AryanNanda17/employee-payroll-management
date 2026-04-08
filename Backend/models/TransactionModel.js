import Employee from './EmployeeModel.js';
import Position from './PositionModel.js';
import Attendance from './AttendanceModel.js';

export async function getEmployeeData() {
    try {
        const employees = await Employee.findAll();
        return employees.map(p => ({
            nik: p.nik,
            employee_name: p.employee_name,
            positionId: p.positionId
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getAttendanceData() {
    try {
        const attendanceData = await Attendance.findAll();
        return attendanceData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getPositionData() {
    try {
        const positions = await Position.findAll();
        return positions.map(j => ({
            position_name: j.position_name,
            basic_salary: j.basic_salary,
            transport_allowance: j.transport_allowance,
            meal_allowance: j.meal_allowance
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}
