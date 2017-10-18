const Sequelize = require('sequelize');
const db = require('../db');

const Soundfile = db.define('soundfile', {
  filename: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  url: {
    type: Sequelize.VIRTUAL,
    get() {
      return `/${this.getDataValue('filename')}`;
    },
  },
});

module.exports = Soundfile;
