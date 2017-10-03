const Sequelize = require('sequelize')
const db = require('../db')

// REVIEW: was there ever an idea to allow for commenting at a timestamp?
const Comment = db.define('comment', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Comment;
