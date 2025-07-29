import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Review = sequelize.define('review', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  text_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stele: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false
});

Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Review; 