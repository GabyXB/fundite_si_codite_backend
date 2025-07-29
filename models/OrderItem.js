import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderItem = sequelize.define('OrderItem', {
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'comenzi',  // Presupun că ai un model pentru comenzi
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',  // Presupun că ai un model pentru produse
      key: 'id',
    },
  },
  cantitate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pret: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'produse_comanda',  // Numele tabelului
});

export default OrderItem;
