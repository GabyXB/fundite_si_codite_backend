import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  nume: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pret: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  detalii: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  imagine: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cantitate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'store', // Setezi tabela corectă
  timestamps: false,
});

export default Product;
