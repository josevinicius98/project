import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Client = sequelize.define(
  'Client',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    taxId: {
      type: DataTypes.STRING,
    },
    contactPerson: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

export default Client;