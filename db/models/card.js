'use strict';
module.exports = (sequelize, DataTypes) => {
  const card = sequelize.define('card', {
    front: DataTypes.STRING,
    back: DataTypes.STRING,
    collectionId: DataTypes.INTEGER
  }, {});
  card.associate = function(models) {
    // associations can be defined here
    models.card.belongsTo(models.collection)
  };
  return card;
};