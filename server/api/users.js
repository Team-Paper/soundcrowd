const router = require('express').Router()
const { User, Song, Comment } = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.get('/:id/songs', (req, res, next) => {
  const userId = Number(req.params.id);
  User.findOne({ where: { id: userId }, include: [{ model: Song, as: 'compositions' }] })
    .then(user => user.compositions)
    .then(songs => songs.map((song) => {
      const { url, id, imageUrl, title, notes, length, playcount } = song;
      const songToReturn = { url, id, imageUrl, title, notes, length, playcount };
      songToReturn.userId = userId;
      return songToReturn;
    }))
    .then(songs => res.json(songs))
    .catch(next)
})

router.get('/:id/comments', (req, res, next) => {
  const id = Number(req.params.id);
  User.findOne({ where: { id: id }, include: [{ model: Comment }] })
    .then(user => res.json(user.comments))
    .catch(next)
})
