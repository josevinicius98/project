import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Client } from './Client.js';
import { User } from './User.js';

export const AccountReceivable = sequelize.define(
  'AccountReceivable',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'partially_paid', 'overdue', 'cancelled'),
      defaultValue: 'pending',
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
AccountReceivable.belongsTo(Client);
Client.hasMany(AccountReceivable);

AccountReceivable.belongsTo(User, { as: 'createdBy' });

export default AccountReceivable;