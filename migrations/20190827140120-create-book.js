'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      author: {
        allowNull: false,
        type: Sequelize.STRING
      },   
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      issuedate: {      
        type: Sequelize.DATE
      },
      memberid: {     
        type: Sequelize.INTEGER
      },
      status: {
        type:Sequelize.ENUM('A','I','D'),              
        allowNull: false,
        defaultValue: 'I'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('books');
  }
};