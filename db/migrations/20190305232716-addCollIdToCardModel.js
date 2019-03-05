'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cards', 'collectionId', Sequelize.INTEGER)
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('cards', 'collectionId')
  }
};
