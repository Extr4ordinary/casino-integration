const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  round_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD'
  },
  bet_info: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  win_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  bet_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'withdraw',
    allowNull: false
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Model ilişkilerini tanımla
Transaction.associate = (models) => {
  Transaction.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Transaction;
