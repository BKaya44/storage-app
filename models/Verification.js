const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db.js');

const Verification = sequelize.define('Verification', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    verification_text: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Verification;
