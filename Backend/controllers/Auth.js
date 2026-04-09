import Employee from "../models/EmployeeModel.js";
import Position from "../models/PositionModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { username: req.body.username }
        });
        if (!employee) return res.status(404).json({ msg: "User not found" });

        const match = await argon2.verify(employee.password, req.body.password);
        if (!match) return res.status(400).json({ msg: "Wrong password" });

        req.session.userId = employee.employee_uuid;

        res.status(200).json({
            id: employee.id,
            employee_uuid: employee.employee_uuid,
            employee_name: employee.employee_name,
            username: employee.username,
            role: employee.role
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please log in to your account!" });
    }
    try {
        const employee = await Employee.findOne({
            attributes: ['id', 'employee_uuid', 'nik', 'employee_name', 'username', 'role', 'positionId', 'photo', 'url'],
            include: [{
                model: Position,
                as: 'position',
                attributes: ['id', 'position_name']
            }],
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "User not found" });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const LogOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Unable to logout" });
        res.status(200).json({ msg: "You have been logged out" });
    });
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ msg: "New password and confirmation do not match" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    try {
        const employee = await Employee.findOne({
            where: { employee_uuid: req.session.userId }
        });
        if (!employee) return res.status(404).json({ msg: "User not found" });

        const match = await argon2.verify(employee.password, currentPassword);
        if (!match) return res.status(400).json({ msg: "Current password is incorrect" });

        const hashPassword = await argon2.hash(newPassword);
        await Employee.update(
            { password: hashPassword },
            { where: { id: employee.id } }
        );

        res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
