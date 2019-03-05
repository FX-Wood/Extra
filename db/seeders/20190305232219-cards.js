'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('cards', [
      {
        front: "Elephant",
        back: "Large quadrupedal mammal with big ears and a trunk",
        collectionId: 1
      },
      {
        front: "Tiger",
        back: "Feline mammal with stripes and large canines",
        collectionId: 1
      },
      {
        front: "Bear",
        back: "Large quadrupedal mammal that can hibernate in the winter",
        collectionId: 1
      },
    ], {});
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('cards', 'null', {});
  }
};
