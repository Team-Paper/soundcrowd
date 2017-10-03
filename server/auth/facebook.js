const passport = require('passport')
const router = require('express').Router()
const FacebookStrategy = require('passport-facebook').Strategy;
const {User} = require('../db/models')
const axios = require('axios')
module.exports = router

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 *
 * process.env.GOOGLE_CLIENT_ID = 'your google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'your google client secret'
 * process.env.GOOGLE_CALLBACK = '/your/google/callback'
 */



const strategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || '',
  clientSecret: process.env.FACEBOOK_APP_SECRET || '',
  callbackURL: process.env.FACEBOOK_CALLBACK || '',
  profileFields:['id','displayName','emails'],
  passReqToCallback: true

},
function(req, accessToken, refreshToken, profile, done) {
  req.session.token = accessToken
  req.session.facebookId = profile.id
  const facebookId = profile.id
  const name = profile.displayName
  const email = profile.emails[0].value
  return User.find({where: {facebookId: profile.id}})
  .then(user => user
    ? done(null, user)
    : User.create({name, email, facebookId})
      .then(user => done(null, user))
  )
  // .then(() => axios.get(`https://graph.facebook.com/v2.9/${facebookId}?fields=id,name&accessToken=${accessToken}`)
  // .then(response => {
  //      console.log(response)
  // }))
  .catch(done)

}
)


passport.use(strategy)

router.get('/', passport.authenticate('facebook', {scope: ['email', 'user_friends']}))

router.get('/callback', passport.authenticate('facebook', {
  successRedirect: '/home',
  failureRedirect: '/login'
}))

router.get('/friends', (req, res, next) => {
  console.log('token', req.session.token)
  console.log('id', req.session.facebookId)
  axios.get(`https://graph.facebook.com/v2.9/${req.session.facebookId}/friends?access_token=${req.session.token}`)
  .then(response => {
    res.json(response.data)
    })
  .catch(console.error)})
