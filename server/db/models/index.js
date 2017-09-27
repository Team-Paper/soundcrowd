const User = require('./user')
const Song = require('./song')
const Comment = require('./comment')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

 //each song can belong to many users as collaborators
 Song.belongsToMany(User, {through: 'collaborators', as: 'artist'});

 //'Likes' tables is just a join table
 Song.belongsToMany(User, {through: 'likes'});
 User.belongsToMany(Song, {through: 'likes'});

 //Comments table is a join table with additional info on it
 Song.belongsToMany(User, {through: Comment});
 User.belongsToMany(Song, {through: Comment});


/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Comment,
  Song
}
