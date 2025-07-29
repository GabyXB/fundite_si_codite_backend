import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CartItem = sequelize.define('CartItem', {
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cos', // 🔥 numele real al tabelului pentru Cart
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produse', // 🔥 numele real al tabelului pentru Product
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  cantitate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'produse_cos', // numele tabelei intermediare
});

export default CartItem;
