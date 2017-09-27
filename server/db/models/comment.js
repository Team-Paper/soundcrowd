const Sequelize = require('sequelize')
const db = require('../db')

const Comment = db.define('comment', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = Comment;
