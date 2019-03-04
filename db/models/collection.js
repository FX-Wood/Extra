'use strict';
module.exports = (sequelize, DataTypes) => {
  const collection = sequelize.define('collection', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  collection.associate = function(models) {
    // associations can be defined here
    models.collection.belongsTo(models.user)
    models.collection.hasMany(models.card);
  };
  return collection;
};