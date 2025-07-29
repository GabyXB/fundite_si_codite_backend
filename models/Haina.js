import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Haina = sequelize.define('Haina', {
  nume: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pret: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  detalii: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  material: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  marime: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  cantitate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagine: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  imagine_gen: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'haine',
  timestamps: false,
});

export default Haina; 