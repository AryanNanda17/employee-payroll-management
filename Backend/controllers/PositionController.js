import Position from "../models/PositionModel.js";
import crypto from "crypto";

export const getPositions = async (req, res) => {
    try {
        const response = await Position.findAll({
            attributes: ['id', 'position_uuid', 'position_name', 'basic_salary', 'transport_allowance', 'meal_allowance']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createPosition = async (req, res) => {
    const { position_name, basic_salary, transport_allowance, meal_allowance } = req.body;
    try {
        await Position.create({
            position_uuid: crypto.randomUUID(),
            position_name,
            basic_salary,
            transport_allowance,
            meal_allowance
        });
        res.status(201).json({ msg: "Position data created successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updatePosition = async (req, res) => {
    try {
        const position = await Position.findOne({
            where: { id: req.params.id }
        });
        if (!position) return res.status(404).json({ msg: "Position not found" });

        const { position_name, basic_salary, transport_allowance, meal_allowance } = req.body;
        await Position.update(
            { position_name, basic_salary, transport_allowance, meal_allowance },
            { where: { id: position.id } }
        );
        res.status(200).json({ msg: "Position data updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletePosition = async (req, res) => {
    try {
        const position = await Position.findOne({
            where: { id: req.params.id }
        });
        if (!position) return res.status(404).json({ msg: "Position not found" });

        await position.destroy();
        res.status(200).json({ msg: "Position data deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
