import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';  // Importă conexiunea la baza de date

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  had_appointment: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: false // 🔥 Adaugă asta ca să scapi de problema cu coloanele lipsă
});

export default User;
