const router = require('express').Router()
const { Song, Comment } = require('../db/models')
module.exports = router

//get all songs
router.get('/', (req, res, next) => {
  Song.findAll()
    .then(songs => res.json(songs))
    .catch(next)
})

// get all comments for a particular song
router.get('/:id/comments', (req, res, next) => {
  Song.findOne({ where: { id: Number(req.params.id) }, include: [Comment] })
    .then(song => res.json(song.comments))
    .catch(next);
});

//get a number of top-liked songs
router.get('/top/:number', (req, res, next) => {
  const limit = Number(req.params.number);
  Song.findAll({ order: [['playcount', 'DESC']], limit: limit })
    .then(songs => res.json(songs))
    .catch(next)
})

//get a specific song
router.get('/:id', (req, res, next) => {
  Song.findById(Number(req.params.id))
    .then(song => res.json(song))
    .catch(next)
})

//to increment play count
router.put('/played/:id', (req, res, next) => {
  Song.findById(Number(req.params.id))
    .then(song => song.incrementPlaycount())
    .then(song => res.sendStatus(204))
    .catch(next)
})

//"like" a song
router.put('/like/:id', (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else Song.findById(Number(req.params.id))
    .then(song => song.like(req.user.id))
    .then(song => res.sendStatus(200))
    .catch(next)
})

//"unlike" a song
router.put('/unlike/:id', (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else Song.findById(Number(req.params.id))
    .then(song => song.unlike(req.user.id))
    .then(song => res.sendStatus(200))
    .catch(next)
})
