const router = require('express').Router()
const { User, Song, Comment, Project, Collaborators } = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'username']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.get('/:id/songs', (req, res, next) => {
  const userId = Number(req.params.id);
  Song.findAll({ where: { '$artist.id$': userId }, include: [{ model: User, as: 'artist', though: Collaborators }, { model: Comment }] })
    .then(songs => res.json(songs))
    .catch(next);
});

router.get('/:id/comments', (req, res, next) => {
  const id = Number(req.params.id);
  User.findOne({ where: { id: id }, include: [{ model: Comment }] })
    .then(user => res.json(user.comments))
    .catch(next);
});

router.get('/:id/comments-about', (req, res, next) => {
  const userId = Number(req.params.id);
  Song.findAll({ where: { '$artist.id$': userId }, include: [{ model: User, as: 'artist', though: Collaborators }, { model: Comment }] })
    .then(songs => Promise.all(songs.map(song => Comment.findAll({ where: { songId: song.id }, include: [{ model: User }]}))))
    .then(resultArr => resultArr.reduce((arr, val) => arr.concat(val), []))
    .then(result => result.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5))
    .then(result => res.json(result))
    .catch(next);
});

router.get('/:id/projects', (req, res, next) => {
  const userId = Number(req.params.id);
  Project.scope('withUsers').findAll({ where: { '$users.id$': userId } })
    .then(projects => {
      return Promise.all(projects.map(project => {
        return Project.scope('withUsers').findOne({ where: { id: project.id }});
      }))})
    .then(projects => res.json(projects))
    .catch(next)
});

router.get('/:id/collaborators', (req, res, next) => {
  const userId = Number(req.params.id);
  Collaborators.findAll({ where: { userId }})
    .then(usersEntries => {
      const songIdObj = {};
      return Promise.all(usersEntries
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter(entry => {
          if (songIdObj[entry.songId]) return false;
          else {
            songIdObj[entry.songId] = true;
            return true;
          }
        })
        .map(entry => Collaborators.findAll({ where: { songId: entry.songId }, limit: 6 }))
      )})
      .then(resultArr => resultArr.reduce((acc, val) => acc.concat(val), []))
      .then(join => Promise.all(join.map(entry => User.findById(entry.userId))))
      .then(result => result.filter(entry => +entry.id !== userId).slice(0, 5))
      .then(result => res.json(result))
      .catch(next);
});

router.get('/fb/:id', (req, res, next) => {
  User.findOne({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'username'],
    where: { facebookId: req.params.id },
  })
    .then(users => res.json(users))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  User.findById(Number(req.params.id))
    .then(users => res.json(users))
    .catch(next);
});


router.put('/:id', (req, res, next) => {
  User.findById(Number(req.params.id))
    .then(user => user.update(req.body))
    .then(updatedUser => res.json(updatedUser))
    .catch(next);
});
