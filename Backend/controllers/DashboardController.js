import Employee from "../models/EmployeeModel.js";
import Position from "../models/PositionModel.js";
import Attendance from "../models/AttendanceModel.js";

export const getDashboardStats = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        const positions = await Position.findAll();
        const attendance = await Attendance.findAll();

        const totalEmployees = employees.length;
        const totalPositions = positions.length;
        const totalAttendance = attendance.length;
        const totalAdmins = employees.filter(e => e.role === 'admin').length;

        const genderDistribution = {
            male: employees.filter(e => e.gender === 'Male').length,
            female: employees.filter(e => e.gender === 'Female').length
        };

        const statusDistribution = {
            permanent: employees.filter(e => e.status === 'Permanent Employee').length,
            contract: employees.filter(e => e.status === 'Contract Employee').length
        };

        const currentYear = new Date().getFullYear();
        const currentYearAttendance = attendance.filter(a => a.year === currentYear);

        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const monthlyAttendance = {};
        months.forEach(m => {
            const records = currentYearAttendance.filter(a => a.month === m);
            if (records.length > 0) {
                monthlyAttendance[m] = {
                    present: records.reduce((s, r) => s + (r.present || 0), 0),
                    sick: records.reduce((s, r) => s + (r.sick || 0), 0),
                    absent: records.reduce((s, r) => s + (r.absent || 0), 0),
                    count: records.length
                };
            }
        });

        res.status(200).json({
            totalEmployees,
            totalAdmins,
            totalPositions,
            totalAttendance,
            genderDistribution,
            statusDistribution,
            monthlyAttendance
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
