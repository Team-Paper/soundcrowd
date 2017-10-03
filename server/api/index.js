const router = require('express').Router()
const User = require('../db/models');

module.exports = router;

// Grabs the user requested in the param and adds the user object
// to req. This is needed for the gatekeeper middleware to function.
router.param('id', (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) res.sendStatus(404)
      req.userId = user;
      next();
      return null;
    })
    .catch(next);
});

router.use('/projects', require('./projects'));
router.use('/songs', require('./songs'));
router.use('/comments', require('./comments'));
router.use('/users', require('./users'));
router.use('/soundfiles', require('./soundfiles'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
