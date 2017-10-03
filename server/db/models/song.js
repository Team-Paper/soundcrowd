const Sequelize = require('sequelize');
const db = require('../db');

// REVIEW: how do you deal  with multiple exports of the same project?
//         will those be new songs? Or will they replace the existing song?
//         How would that mess with inline comments?
const Song = db.define('song', {
  url: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  trackArtUrl: {
    type: Sequelize.STRING,
  },
  notes: {
    type: Sequelize.TEXT,
  },
  length: Sequelize.FLOAT,
  playcount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Song.prototype.incrementPlaycount = function () {
  return this.update({ playcount: this.playcount + 1 });
};

Song.prototype.like = function (userId) {
  return this.addUser(userId);
};

Song.prototype.unlike = function (userId) {
  return this.removeUser(userId);
};

module.exports = Song;
