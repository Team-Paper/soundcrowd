const db = require('./server/db/db');
const { User, Song, Comment } = require('./server/db/models');

const users = [
  { email: 'admin@admin.admin', password: 'admin', bio: 'I am probably an admin account on this website so don\'t piss me off.', userImage: 'https://pbs.twimg.com/profile_images/596511405999661056/f04wv26A.jpg' },
  { email: 'user@user.user', password: 'user', bio: 'I am a regular user account on this website and I\'m really nice.', userImage: 'https://i.pinimg.com/736x/11/8a/c3/118ac35750a187594912120b941f83a4--vice-versa-smiley-faces.jpg' },
  { email: 'user2@user.user', password: 'user', bio: 'I am a regular user account on this website and I\'m somewhat nice.', userImage: 'https://i.pinimg.com/736x/11/8a/c3/118ac35750a187594912120b941f83a4--vice-versa-smiley-faces.jpg' },
  { email: 'user3@user.user', password: 'user', bio: 'I am a regular user account on this website and I love music and dancing.', userImage: 'https://target.scene7.com/is/image/Target/18822717_Alt01?wid=520&hei=520&fmt=pjpeg' },
];

const songs = [
  { url: 'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/01%20The%20Tea%20Party.mp3', notes: 'this is a song i wrote about tea parties', length: 364, playcount: 5, title: 'The Tea Party' },
  { url: 'https://storage.googleapis.com/juke-1379.appspot.com/juke-music/Dexter%20Britain/Creative%20Commons%20Volume%202/03%20My%20Song%20For%20January.mp3', notes: 'this is a song i wrote about january and the feelings it gives me', length: 452, playcount: 15, title: 'My Song for January' },
];

const comments = [
  { text: 'This song is great' },
  { text: 'This song is beautiful' },
  { text: 'This song moved me to tears' },
  { text: 'This is great' },
  { text: 'This song reminds me of another song but I don\'t know which?' },
  { text: 'This song sucks' },
  { text: 'This song proves that the artist(s) are genius(es)!' },
  { text: 'This song is the bomb' },
];

db.sync({ force: true })
  .then(() => Promise.all(users.map(user => User.create(user))))
  .then((createdUsers) => {
    console.log(`created ${createdUsers.length} users`);
    const createdSongs = songs.map(song => Song.create(song));
    return Promise.all([Promise.all(createdSongs), createdUsers]);
  })
  .then(([createdSongs, createdUsers]) => {
    createdSongs.forEach((song) => {
      const repeats = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < repeats; i++) {
        song.addArtist(createdUsers[Math.floor(Math.random() * createdUsers.length)]);
      }
    });
    return createdSongs;
  })
  .then((savedSongs) => {
    console.log(`created ${savedSongs.length} songs`);
    const createdComments = comments.map(comment => Comment.create(comment));
    return Promise.all(createdComments);
  })
  .then((savedComments) => {
    savedComments.forEach((comment) => {
      comment.songId = Math.floor(Math.random() * songs.length) + 1;
      comment.userId = Math.floor(Math.random() * users.length) + 1;
    });
    return savedComments.map(comment => comment.save());
  })
  .then(savedComments => console.log(`created ${savedComments.length} comments`))
  // .then(() => db.close())
  .catch(console.error.bind(console));
