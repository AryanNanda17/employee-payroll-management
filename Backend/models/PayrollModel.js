import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Payroll = db.define('payroll', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nik: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    employee_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    position_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    month: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    basic_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    transport_allowance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    meal_allowance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    gross_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    present_days: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sick_days: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    absent_days: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    absent_deduction: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sick_deduction: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_deduction: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    net_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'processed'
    },
    processed_by: {
        type: DataTypes.STRING(100)
    }
}, { freezeTableName: true });

export default Payroll;
