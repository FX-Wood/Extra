'use strict';
module.exports = (sequelize, DataTypes) => {
  const collection = sequelize.define('collection', {
    name: DataTypes.STRING
  }, {});
  collection.associate = function(models) {
    // associations can be defined here
    models.collection.hasMany(models.card)
  };
  return collection;
};