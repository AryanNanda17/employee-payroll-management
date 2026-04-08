import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

const SalaryDeduction = db.define('salary_deductions',{
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        deduction: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        deduction_amount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    },{freezeTableName: true
});

export default SalaryDeduction;
