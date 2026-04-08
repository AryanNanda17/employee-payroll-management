import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Employee from './EmployeeModel.js';

const {DataTypes} = Sequelize;

const Position = db.define('positions',{
        position_uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        position_name: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        basic_salary: {
            type: DataTypes.INTEGER(50),
            allowNull: false
        },
        transport_allowance: {
            type: DataTypes.INTEGER(50),
            allowNull: false
        },
        meal_allowance: {
            type: DataTypes.INTEGER(50)
        }
    },{
        freezeTableName: true
});

Position.hasMany(Employee, { foreignKey: 'positionId' });
Employee.belongsTo(Position, { foreignKey: 'positionId', as: 'position' });

export default Position;
