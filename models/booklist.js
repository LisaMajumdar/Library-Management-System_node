'use strict';
module.exports = (sequelize, DataTypes) => {
  const booklist = sequelize.define('booklist', {
    name: DataTypes.STRING,
    book_id: DataTypes.INTEGER,
    status: { 
      type : DataTypes.ENUM('A','NA','C'),
      allowNull: false,
      defaultValue: 'NA'
    }
  }, {});
  booklist.associate = function(models) {
    // associations can be defined here
  };
  return booklist;
};