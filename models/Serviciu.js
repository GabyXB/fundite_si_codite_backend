// models/Serviciu.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Serviciu = sequelize.define('Serviciu', {
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pret: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  detalii: {
  type: DataTypes.TEXT,
  allowNull: true,
  },
  imagine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categorie: {
  type: DataTypes.STRING(50),
  allowNull: false,
  defaultValue: 'Tuns',
  }
}, {
  tableName: 'servicii',
  timestamps: false,
});

export default Serviciu;
