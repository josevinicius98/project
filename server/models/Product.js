import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Supplier } from './Supplier.js';

export const Product = sequelize.define(
  'Product',
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
    description: {
      type: DataTypes.TEXT,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    minStockLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
Product.belongsTo(Supplier);
Supplier.hasMany(Product);

export default Product;