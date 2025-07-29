import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cart = sequelize.define('Cart', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Presupun că ai un model `User` pentru utilizatori
      key: 'id',
    }
  },
}, {
  timestamps: true,
  tableName: 'cos',  // Numele tabelului
});

export default Cart;
