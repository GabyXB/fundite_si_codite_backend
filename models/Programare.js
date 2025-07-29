import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from "./User.js";
import Pet from "./Pet.js";
import Serviciu from "./Serviciu.js";
import Employee from "./Employee.js";


const Programare = sequelize.define('Programare', {
  serviciu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicii',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pets',
      key: 'id',
    },
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Valoarea implicită este 0 (în așteptare)
    validate: {
      isIn: [[-1, 0, 1, 2]], // Valori permise: -1, 0, 1, 2
    },
  },
  angajat_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
}, {
  tableName: 'programare',
  timestamps: false,
});

Programare.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Programare.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });
Programare.belongsTo(Serviciu, { foreignKey: 'serviciu_id', as: 'serviciu' });
Programare.belongsTo(Employee, { foreignKey: 'angajat_id', as: 'employee' });


export default Programare;
