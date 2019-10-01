'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    memberid: {      
      type:DataTypes.STRING
    },
    name: {
    	allowNull: false,
    	type:DataTypes.STRING
    },
    email: {
    	allowNull: false,
    	type:DataTypes.STRING
    },   
    password: {
    	allowNull: false,
    	type:DataTypes.STRING
    },
    mobile:{
      allowNull: false,
      type:DataTypes.STRING
    },
    token:{
      allowNull: false,
      type:DataTypes.STRING
    },
    image: {
      allowNull: false,
      type:DataTypes.STRING
    },
    type: {
      allowNull: false,
      type:DataTypes.STRING
    },
    status: { 
      type : DataTypes.ENUM('A','I','D'),
      allowNull: false,
      defaultValue: 'I'
     },
    subscribe: { 
      type : DataTypes.ENUM('Yes','No'),
      allowNull: false,
      defaultValue: 'No'
     }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};