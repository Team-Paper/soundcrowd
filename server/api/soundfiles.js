const router = require('express').Router();
const { Soundfile } = require('../db/models');
const multer = require('multer');
const upload = multer({ dest: 'sounds/' });

module.exports = router;

router.post('/', upload.single('blob'), (req, res, next) => {
  console.log('req file', req.file);
  console.log('filename is', req.file.filename);
  Soundfile.create({ filename: req.file.filename })
    .then(soundfile => {
      // delete soundfile.filename;
      res.json(soundfile)
    })
    .catch(next);
});
