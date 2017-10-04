const router = require('express').Router();
const { Song, Comment, User } = require('../db/models');
const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uuidv4 = require('uuid/v4');


const s3 = new AWS.S3();
const myBucket = 'soundcrowd-files-fullstack';

const upload2 = (req, res, next) => {
  console.log('\n\nFILE:\n', req.file);

  req.file.filename = uuidv4()+'.webm';

  s3.createBucket({ Bucket: myBucket }, (err, data) => {
    if (err) next(err);
    else {
      const params = { Bucket: myBucket, Key: req.file.filename, Body: req.file.buffer };
      s3.putObject(params, (err, data) => {
        if (err) next(err);
        else next();
      });
    }
  });

}


// get all songs
router.get('/', (req, res, next) => {
  Song.findAll()
    .then(songs => res.json(songs))
    .catch(next)
});

// upload a mix
router.post('/', upload.single('blob'), upload2, (req, res, next) => {
  Song.create({
    filename: req.file.filename,
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
        model: User, through: 'collaborators', as: 'artist', attributes: ['id', 'username']
      },
    ],
  })
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

module.exports = router;
