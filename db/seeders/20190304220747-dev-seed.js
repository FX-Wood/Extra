'use strict';
const password = require('bcrypt').hashSync('password', 12)


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        id: '1', 
        name: 'q',
        email: 'q@q.qq',
        password: password,
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'asdf',
        email: 'asdf@asdf.asdf',
        password: password,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {})
  }
};
