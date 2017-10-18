const router = require('express').Router();
const { Soundfile } = require('../db/models');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// configuration for AWS
const myBucket = 'soundcrowd-files-fullstack';
const upload2AWS = require('./aws-helper')(myBucket);

module.exports = router;

router.post('/', upload.single('blob'), upload2AWS, (req, res, next) => {
  Soundfile.create({ filename: req.file.filename })
    .then((soundfile) => {
      res.json(soundfile);
    })
    .catch(next);
});
