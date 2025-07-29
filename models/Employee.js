import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('employee', {
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0, // 0 = Stilist
  },
}, {
  timestamps: false
});

export default Employee; 