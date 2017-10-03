const router = require('express').Router();
const { Soundfile } = require('../db/models');
const multer = require('multer');
const upload = multer({ dest: 'sounds/' });

module.exports = router;

router.post('/', upload.single('blob'), (req, res, next) => {
  Soundfile.create({ filename: req.file.filename })
    .then(soundfile => {
      res.json(soundfile)
    })
    .catch(next);
});
