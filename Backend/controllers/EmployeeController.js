import Employee from "../models/EmployeeModel.js";
import Position from "../models/PositionModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export const getEmployees = async (req, res) => {
    try {
        const response = await Employee.findAll({
            attributes: [
                'id', 'employee_uuid', 'nik', 'employee_name',
                'gender', 'positionId', 'join_date',
                'status', 'photo', 'url', 'role'
            ],
            include: [{
                model: Position,
                as: 'position',
                attributes: ['id', 'position_name', 'basic_salary', 'transport_allowance', 'meal_allowance']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const response = await Employee.findOne({
            attributes: [
                'id', 'employee_uuid', 'nik', 'employee_name', 'username',
                'gender', 'positionId', 'join_date',
                'status', 'photo', 'url', 'role'
            ],
            include: [{
                model: Position,
                as: 'position',
                attributes: ['id', 'position_name']
            }],
            where: { id: req.params.id }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "No employee data found for that ID" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createEmployee = async (req, res) => {
    const {
        nik, employee_name,
        username, password, confirmPassword, gender,
        positionId, join_date,
        status, role
    } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password and confirm password do not match" });
    }

    if (!req.files || !req.files.photo) {
        return res.status(400).json({ msg: "No File Uploaded" });
    }

    const file = req.files.photo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image format. Allowed: png, jpg, jpeg" });
    }

    if (fileSize > 2000000) {
        return res.status(422).json({ msg: "Image must be less than 2 MB" });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            const hashPassword = await argon2.hash(password);
            await Employee.create({
                employee_uuid: crypto.randomUUID(),
                nik,
                employee_name,
                username,
                password: hashPassword,
                gender,
                positionId: positionId || null,
                join_date,
                status,
                photo: fileName,
                url,
                role
            });
            res.status(201).json({ msg: "Registration successful" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};

export const updateEmployee = async (req, res) => {
    const employee = await Employee.findOne({
        where: { id: req.params.id }
    });

    if (!employee) return res.status(404).json({ msg: "Employee data not found" });

    const {
        nik, employee_name,
        username, password, confirmPassword, gender,
        positionId, join_date,
        status, role
    } = req.body;

    let fileName = "";
    if (!req.files || !req.files.photo) {
        fileName = employee.photo;
    } else {
        const file = req.files.photo;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) {
            return res.status(422).json({ msg: "Invalid image format. Allowed: png, jpg, jpeg" });
        }
        if (fileSize > 2000000) {
            return res.status(422).json({ msg: "Image must be less than 2 MB" });
        }

        const filepath = `./public/images/${employee.photo}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    let hashPassword;
    if (!password || password === "") {
        hashPassword = employee.password;
    } else {
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Password and confirm password do not match" });
        }
        hashPassword = await argon2.hash(password);
    }

    try {
        await Employee.update({
            nik,
            employee_name,
            username,
            password: hashPassword,
            gender,
            positionId: positionId || null,
            join_date,
            status,
            photo: fileName,
            url,
            role
        }, {
            where: { id: employee.id }
        });
        res.status(200).json({ msg: "Employee data updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    const employee = await Employee.findOne({
        where: { id: req.params.id }
    });
    if (!employee) return res.status(404).json({ msg: "Employee data not found" });

    const filepath = `./public/images/${employee.photo}`;
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }

    try {
        await Employee.destroy({ where: { id: employee.id } });
        res.status(200).json({ msg: "Employee data deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
