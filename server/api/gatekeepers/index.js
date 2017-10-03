/** GATEKEEPERS
  Use these functions to restrict access to different API routes.
  E.g.
  router.get('/', isAdmin, (req, res, next) => {
    Model.findAll({})
      .then(stuff => res.json(stuff))
      .catch(next)
  })
*/

/*
 * This was written by Finn (@fterdal) during the Grace Shopper project
 * and borrowed with some alterations by Tess (@omnomnomtea)
 * during capstone project
 * Original code can be found at github.com/TGFR/Anchor
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

// Only allows admins
const isAdmin = (req, res, next) => {
  if (!req.user) res.sendStatus(401); // not logged in
  else if (!req.user.isAdmin) res.sendStatus(403); // not an admin
  else next(); // is an admin
};

// Allow admins or the user themselves
const isSelfOrAdmin = (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else if (!req.user.isAdmin && req.user.id !== req.userId.id) res.sendStatus(403);
  else next();
};

module.exports = {
  isAdmin,
  isSelfOrAdmin,
  isLoggedIn,
  isSelf,
};
