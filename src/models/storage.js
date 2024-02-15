const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const User = require('./user.js');

const Storage = db.define('Storage', {
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

const StorageImage = db.define('StorageImage', {
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

const Item = db.define('Item', {
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

const ItemImage = db.define('ItemImage', {
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
