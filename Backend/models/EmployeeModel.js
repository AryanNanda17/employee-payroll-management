import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

const Employee = db.define('employees', {
    employee_uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nik: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    employee_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    positionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'positions',
            key: 'id'
        }
    },
    join_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    url: DataTypes.STRING,
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

export default Employee;
