const router = require('express').Router()
const {Song} = require('../db/models')
module.exports = router

//get all songs
router.get('/', (req, res, next) => {
  Song.findAll()
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
router.put('/like/:id',(req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else Song.findById(Number(req.params.id))
    .then(song => song.like(req.user.id))
    .then(song => res.sendStatus(200))
    .catch(next)
})
