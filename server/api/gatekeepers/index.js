/** GATEKEEPERS
  Use these functions to restrict access to different API routes.

  E.g.
  router.post('/', isSelf, (req, res, next) => {
    Model.create(res.body)
      .then(stuff => res.json(stuff))
      .catch(next)
  })

  would restrict users from creating a Model with a userId that is not their own


*/


const isLoggedIn = (req, res, next) => {
  if (!req.user) res.sendStatus(401); // not logged in
  else next();
};

const isSelf = (req, res, next) => {
  // not logged in or possibly impersonating someone else
  if (!req.user || req.body.userId !== req.user.id) res.sendStatus(401);
  else next();
};

module.exports = {
  isLoggedIn,
  isSelf,
};
