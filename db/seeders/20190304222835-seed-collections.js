'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('collections', [
      {
        name: 'Animals',
        description: 'Includes animals like elephant, tiger, bear, and bird',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Household items',
        description: 'Includes items like broom, closet, chair, table, cup, bowl, and television',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Foods',
        description: 'Includes foods like rice, pork, beans, pizza, cookies, sandwich, tortilla, cheese',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('collections', {})
  }
};
