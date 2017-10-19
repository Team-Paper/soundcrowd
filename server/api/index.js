const router = require('express').Router();

module.exports = router;

router.use('/projects', require('./projects'));
router.use('/songs', require('./songs'));
router.use('/comments', require('./comments'));
router.use('/users', require('./users'));
router.use('/soundfiles', require('./soundfiles'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
