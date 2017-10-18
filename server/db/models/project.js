const Sequelize = require('sequelize');
const db = require('../db');

const Project = db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// scopes are defined in index.js

module.exports = Project;
