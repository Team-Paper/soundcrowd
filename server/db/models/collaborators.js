const db = require('../db');

module.exports = db.define('collaborator', {}, {
  tableName: 'collaborators',
});
