'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {  
    bookname: {
    	allowNull: false,
    	type:DataTypes.STRING
    },
    author: {
    	allowNull: false,
    	type:DataTypes.STRING
    },   
    quantity: {
    	allowNull: false,
    	type:DataTypes.INTEGER
    },
    catId: {
      //allowNull: false,
      type:DataTypes.INTEGER
    },
    issuedate: {    	
    	type:DataTypes.DATE
    },
    memberid: {    	
    	type:DataTypes.INTEGER
    },
    image: {
      allowNull: false,
      type:DataTypes.STRING
    },
    status: { 
      type : DataTypes.ENUM('A','I','D'),
      allowNull: false,
      defaultValue: 'A'
    }
  }, {});
  book.associate = function(models) {
    // associations can be defined here
  };
  return book;
};