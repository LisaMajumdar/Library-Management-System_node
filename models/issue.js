'use strict';
module.exports = (sequelize, DataTypes) => {
  const issue = sequelize.define('issue', {
    book_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    BookAllotId : DataTypes.STRING,
    booklistId : DataTypes.INTEGER,
    fineAmt  : DataTypes.STRING,
    issueDate : DataTypes.STRING,
    status: { 
      type : DataTypes.ENUM('A','I','D'),
      allowNull: false,
      defaultValue: 'A'
    }
  }, {});
  issue.associate = function(models) {
    // associations can be defined here
  };
  return issue;
};