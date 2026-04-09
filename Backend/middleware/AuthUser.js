import Employee from '../models/EmployeeModel.js';

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please log in to your account!" });
    }
    try {
        const employee = await Employee.findOne({
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "User not found" });
        req.userId = employee.id;
        req.role = employee.role;
        req.employeeNik = employee.nik;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "A server error occurred" });
    }
};

export const adminOnly = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "Employee data not found" });
        if (employee.role !== "admin") return res.status(403).json({ msg: "Access denied. Admin privileges required." });
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "A server error occurred" });
    }
};

export const employeeOnly = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please log in to your account!" });
    }
    try {
        const employee = await Employee.findOne({
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "User not found" });
        req.userId = employee.id;
        req.role = employee.role;
        req.employeeNik = employee.nik;
        req.employeeName = employee.employee_name;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "A server error occurred" });
    }
};
