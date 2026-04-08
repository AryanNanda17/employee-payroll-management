import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

const Attendance = db.define('attendance',{
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        month: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        year: {
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
        gender: {
            type: DataTypes.STRING(20)
        },
        position_name: {
            type: DataTypes.STRING(50)
        },
        present: {
            type: DataTypes.INTEGER(11)
        },
        sick: {
            type: DataTypes.INTEGER(11)
        },
        absent: {
            type: DataTypes.INTEGER(11)
        },
    },{freezeTableName: true});

export default Attendance;
