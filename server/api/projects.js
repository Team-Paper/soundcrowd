const router = require('express').Router();
const { Project } = require('../db/models');
const { isSelfOrAdmin, isSelf } = require('./gatekeepers');

module.exports = router;

// get a specific project
router.get('/:projectId', (req, res, next) => {
  Project.findById(Number(req.params.id))
    .then(comment => res.json(comment))
    .catch(next);
});

// create a new project
// the isSelf gatekeeper makes sure that users cannot
// make a project for another user
router.post('/', isSelf, (req, res, next) => {
  Project.create(req.body)
    .then(project => res.json(project))
    .catch(next);
});

// update project
router.put('/:id', isSelf, (req, res, next) => {
  Project.findById(Number(req.params.id))
    .then(project => res.json(project.update(req.body)))
    .catch(next);
});
