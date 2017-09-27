const Sequelize = require('sequelize')
const db = require('../db')

const Song = db.define('song', {
  url: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  length: Sequelize.NUMBER,
  playcount: Sequelize.INTEGER,
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Song;
