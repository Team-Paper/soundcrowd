const router = require('express').Router()
const { Comment, User } = require('../db/models')
const { isSelf } = require('./gatekeepers')

module.exports = router

// attach the user's id to the body so that
//  updating and creating comments will have the correct userId
router.use((req, res, next) => {
  if (req.user) req.body.userId = req.user.id;
  next();
});

// get 5 latest comments
router.get('/', (req, res, next) => {
  Comment.findAll({ limit: 5, include: [{ model: User }], order: [['createdAt', 'DESC']] })
    .then(comments => res.json(comments))
    .catch(next);
});

//get a specific comment
router.get('/:id', (req, res, next) => {
  Comment.findById(Number(req.params.id))
    .then(comment => res.json(comment))
    .catch(next)
});

//post a new comment
router.post('/', isSelf, (req, res, next) => {
  Comment.create(req.body)
    .then(comment => res.json(comment))
    .catch(next)
});

//update a comment
router.put('/:id', isSelf, (req, res, next) => {
  Comment.findById(Number(req.params.id))
    .then(comment => comment.update(req.body))
    .then(comment => res.json(comment))
    .catch(next)
})

//delete a comment
router.delete('/:id', (req, res, next) => {
  Comment.findById(Number(req.params.id))
    .then(comment => comment.destroy(req.body))
    .then(() => res.sendStatus(204))
    .catch(next)
})
