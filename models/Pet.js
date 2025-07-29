import DataTypes from 'sequelize';
import sequelize from '../config/database.js';

const Pet = sequelize.define('Pets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    specie: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    talie: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // referință la modelul Users
            key: 'id',
        },
    },
}, {
  tableName: 'pets',
  timestamps: false, // 🔥 Adaugă asta ca să scapi de problema cu coloanele lipsă
});

Pet.associate = (models) => {
    // Definirea relației între Pets și User
    Pet.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

export default Pet;
