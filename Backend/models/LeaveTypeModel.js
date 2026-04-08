import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const LeaveType = db.define('leave_types', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    days_per_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { freezeTableName: true });

export default LeaveType;
