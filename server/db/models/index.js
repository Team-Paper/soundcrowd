const User = require('./user')
const Song = require('./song')
const Comment = require('./comment')
const Project = require('./project')
const Soundfile = require('./soundfile')
const Collaborators = require('./collaborators')

//each song can belong to many users as collaborators
//each collaborator can have many songs
Song.belongsToMany(User, { through: Collaborators, as: 'artist' });
User.belongsToMany(Song, { through: Collaborators, as: 'compositions' });

//'Likes' tables is just a join table
Song.belongsToMany(User, { through: 'likes' });
User.belongsToMany(Song, { through: 'likes' });

//Comments table is a join table with additional info on it
Comment.belongsTo(User);
Comment.belongsTo(Song);
Song.hasMany(Comment);
User.hasMany(Comment);

// Project just has an id and a title
// The project table is our source of truth for firebase project ids
Project.belongsToMany(User, { through: 'usersProjects' });
User.belongsToMany(Project, { through: 'usersProjects' });

// Each song can come from a project so let's link these together
// That way there's a sort of paper trail between the original project
// and the song that is mixed down from it
Song.belongsTo(Project);

Project.addScope('withUsers', { include: [{ model: User }]});

module.exports = {
  User,
  Comment,
  Song,
  Soundfile,
  Project,
  Collaborators,
}
