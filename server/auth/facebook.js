const passport = require('passport');
const router = require('express').Router();
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../db/models');
const axios = require('axios');

module.exports = router;


const strategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || '',
  clientSecret: process.env.FACEBOOK_APP_SECRET || '',
  callbackURL: process.env.FACEBOOK_CALLBACK || '',
  profileFields: ['id', 'displayName', 'emails', 'picture.type(large)'],
  passReqToCallback: true,

},
((req, accessToken, refreshToken, profile, done) => {
  req.session.token = accessToken;
  req.session.facebookId = profile.id;
  const facebookId = profile.id;
  const name = profile.displayName;
  const email = profile.emails[0].value;
  const photo = profile._json.picture.data.url;
  return User.find({ where: { facebookId: profile.id } })
    .then(user => (user
      ? done(null, user)
      : User.create({ username: name, email, facebookId, userImage: photo })
        .then(user => done(null, user))),
    )
    .catch(done);
}),
);


passport.use(strategy);

router.get('/', passport.authenticate('facebook', { scope: ['email', 'user_friends'] }));

router.get('/callback', passport.authenticate('facebook', {
  successRedirect: '/home',
  failureRedirect: '/login',
}));

router.get('/friends', (req, res, next) => {
  axios.get(`https://graph.facebook.com/v2.9/${req.session.facebookId}/friends?access_token=${req.session.token}`)
    .then((response) => {
      const friendsArray = response.data.data;
      return Promise.all(friendsArray.map(friend => (
        User.findOne({ where: { facebookId: friend.id } })
      )));
    })
    .then((friends) => {
      res.json(friends.filter(friend => friend !== null));
    })
    .catch(next);
});

