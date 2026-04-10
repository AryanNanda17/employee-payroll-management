import SalaryDeduction from "../models/SalaryDeductionModel.js";

export const getDeductions = async (req, res) => {
    try {
        const deductions = await SalaryDeduction.findAll({
            attributes: ['id', 'deduction', 'deduction_amount']
        });
        res.status(200).json(deductions);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getDeductionById = async (req, res) => {
    try {
        const deduction = await SalaryDeduction.findOne({
            where: { id: req.params.id }
        });
        if (!deduction) return res.status(404).json({ msg: "Deduction not found" });
        res.status(200).json(deduction);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createDeduction = async (req, res) => {
    const { deduction, deduction_amount } = req.body;
    if (!deduction || deduction_amount === undefined) {
        return res.status(400).json({ msg: "Deduction name and amount are required" });
    }
    try {
        await SalaryDeduction.create({ deduction, deduction_amount });
        res.status(201).json({ msg: "Salary deduction created successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateDeduction = async (req, res) => {
    try {
        const existing = await SalaryDeduction.findOne({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ msg: "Deduction not found" });

        const { deduction, deduction_amount } = req.body;
        await SalaryDeduction.update(
            { deduction, deduction_amount },
            { where: { id: existing.id } }
        );
        res.status(200).json({ msg: "Salary deduction updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteDeduction = async (req, res) => {
    try {
        const existing = await SalaryDeduction.findOne({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ msg: "Deduction not found" });

        await existing.destroy();
        res.status(200).json({ msg: "Salary deduction deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
