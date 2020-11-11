'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true
    },
    materialsNeeded: {
    type: Sequelize.STRING,
        allowNull: true
    },
    userId: Sequelize.INTEGER
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      },
    });
  };
  
  return Course;
};