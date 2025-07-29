import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // Presupun că ai un model pentru utilizatori
      key: 'id',
    },
  },
  pret_total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'comenzi',  // Numele tabelului
});

export default Order;
