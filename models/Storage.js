const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const User = require('./User');

const Storage = sequelize.define('Storage', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

const StorageImage = sequelize.define('StorageImage', {
  path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

const ItemImage = sequelize.define('ItemImage', {
  path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Storage, { foreignKey: 'user_id' });
Storage.belongsTo(User, { foreignKey: 'user_id' });

Storage.hasMany(StorageImage, { foreignKey: 'storage_id' });
StorageImage.belongsTo(Storage, { foreignKey: 'storage_id' });

Storage.hasMany(Item, { foreignKey: 'storage_id' });
Item.belongsTo(Storage, { foreignKey: 'storage_id' });

User.hasMany(StorageImage, { foreignKey: 'user_id' });
StorageImage.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ItemImage, { foreignKey: 'user_id' });
ItemImage.belongsTo(User, { foreignKey: 'user_id' });

Item.hasMany(ItemImage, { foreignKey: 'item_id' });
ItemImage.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = { Storage, StorageImage, Item, ItemImage };
