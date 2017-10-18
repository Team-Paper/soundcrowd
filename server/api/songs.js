const router = require('express').Router();
const { Song, Comment, User } = require('../db/models');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// configuration for AWS
const myBucket = 'soundcrowd-songs-fullstack';
const upload2AWS = require('./aws-helper')(myBucket, 'songs/');

// get all songs
router.get('/', (req, res, next) => {
  Song.findAll()
    .then(songs => res.json(songs))
    .catch(next);
});

// upload a mix
router.post('/', upload.single('blob'), upload2AWS, (req, res, next) => {
  Song.create({
    filename: req.file.filename,
    title: req.body.mixTitle,
  })
    .then((song) => {
      song.addArtist(req.session.passport.user);
      return song;
    })
    .then(song => res.json(song))
    .catch(next);
});

// get all comments for a particular song
router.get('/:id/comments', (req, res, next) => {
  Song.findOne({
    where: { id: Number(req.params.id) },
    include: [
      { model: Comment, include: [User] },
    ],
  })
    .then(song => res.json(song.comments))
    .catch(next);
});

// get a number of top-liked songs
router.get('/top/:number', (req, res, next) => {
  const limit = Number(req.params.number);
  Song.findAll({
    order: [['playcount', 'DESC']],
    limit,
    include: [
      {
        model: User, through: 'collaborators', as: 'artist', attributes: ['id', 'username'],
      },
    ],
  })
    .then(songs => res.json(songs))
    .catch(next);
});

// get a specific song
router.get('/:id', (req, res, next) => {
  Song.findOne({ where: { id: Number(req.params.id) }, include: [{ model: User, as: 'artist' }] })
    .then(song => res.json(song))
    .catch(next);
});

// to increment play count
router.put('/played/:id', (req, res, next) => {
  Song.findById(Number(req.params.id))
    .then(song => song.incrementPlaycount())
    .then(() => res.sendStatus(204))
    .catch(next);
});

// "like" a song
router.put('/like/:id', (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else {
    Song.findById(Number(req.params.id))
      .then(song => song.like(req.user.id))
      .then(() => res.sendStatus(200))
      .catch(next);
  }
});

// "unlike" a song
router.put('/unlike/:id', (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else {
    Song.findById(Number(req.params.id))
      .then(song => song.unlike(req.user.id))
      .then(() => res.sendStatus(200))
      .catch(next);
  }
});

module.exports = router;
