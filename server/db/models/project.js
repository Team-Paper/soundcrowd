const Sequelize = require('sequelize');
const db = require('../db');

const Project = db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});


module.exports = Project;
