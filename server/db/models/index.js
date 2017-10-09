const User = require('./user')
const Song = require('./song')
const Comment = require('./comment')
const Project = require('./project')
const Soundfile = require('./soundfile')
const Collaborators = require('./collaborators')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

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

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Comment,
  Song,
  Soundfile,
  Project,
  Collaborators,
}
