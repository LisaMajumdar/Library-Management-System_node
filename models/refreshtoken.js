'use strict';
module.exports = (sequelize, DataTypes) => {
  const refreshtoken = sequelize.define('refreshtoken', {
	schemeName: 
	 { 
	  	allowNull: false,
	   	type: DataTypes.STRING
	 },
    itemId: 
     { 
     	allowNull: false,
     	type: DataTypes.INTEGER
     },
    is_active: 
     { 
     	allowNull: false,
     	type: DataTypes.INTEGER
     },
    refreshtoken: 
     { 
     	type : DataTypes.ENUM('0','1'),     	
     	defaultValue:'0'
     }
  }, {});
  refreshtoken.associate = function(models) {
    // associations can be defined here
  };
  return refreshtoken;
};