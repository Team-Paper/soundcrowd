const db = require('./server/db/db');
const { User, Song, Comment, Soundfile } = require('./server/db/models');

const users = [
  { username: 'angryTurds', email: 'admin@admin.admin', password: 'admin', bio: 'I am probably an admin account on this website so don\'t piss me off. 💩', userImage: 'https://pbs.twimg.com/profile_images/596511405999661056/f04wv26A.jpg' },
  { username: 'balletFan29', email: 'user3@user.user', password: 'user', bio: 'I am a regular user account on this website and I love music and dancing.', userImage: 'https://target.scene7.com/is/image/Target/18822717_Alt01?wid=520&hei=520&fmt=pjpeg' },
  { username: 'Sarah M. Conner', email: 'skynetsucks@yahoo.com', password: 'humans4eva', bio: 'Working to stop Skynet, one song at a time.', userImage: 'https://pbs.twimg.com/profile_images/875421214805766144/0TYqbMz5_400x400.jpg' },
  { username: 'River Tam', email: 'TwoBy2@gmail.com', password: 'miranda', bio: 'Ain\'t no power in the verse can stop these sick beats.', userImage: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Summer_Glau_as_River_Tam.jpg' },
  { username: 'Rose Lalonde', email: 'tt2@gmail.com', password: 'tangleBuddies', bio: 'Let us bounce', userImage: 'http://cdn.mspaintadventures.com/storyfiles/hs2/00370.gif' },
  { username: 'Tess McCoolperson', email: 'tessiscool@gmail.com', password: '12345!', bio: 'Nerdcore emo pop punk mood', userImage: 'http://missouriredhawksbaseball.com/wp-content/uploads/2016/06/generic-person-silhouette.jpg'},
  { username: 'Octocat O\'Rainbowdash', email: 'github@gmail.com', password: 'thebestoctocat!', bio: 'Open source is the best source. Free music is a sign of a free culture.', userImage: 'https://octodex.github.com/images/twenty-percent-cooler-octocat.png'},
  { username: 'Martin McCoolperson', email: 'martiniscool@gmail.com', password: '12345!', bio: 'Nerdcore emo pop punk mood', userImage: 'http://missouriredhawksbaseball.com/wp-content/uploads/2016/06/generic-person-silhouette.jpg'},
  { username: 'Greg Coolperson', email: 'gregiscool@gmail.com', password: '12345!', bio: 'Nerdcore emo pop punk mood', userImage: 'http://missouriredhawksbaseball.com/wp-content/uploads/2016/06/generic-person-silhouette.jpg'},
  { username: 'Chris Coolperson', email: 'chrisiscool@gmail.com', password: '12345!', bio: 'Nerdcore emo pop punk mood', userImage: 'http://missouriredhawksbaseball.com/wp-content/uploads/2016/06/generic-person-silhouette.jpg'},
];

const files = [
  { filename: 'beep', url: 'beep.mp3' }, // https://notificationsounds.com/notification-sounds/beep-472 CC-attribution licence
  { filename: 'chafing', url: 'chafing.mp3' },  // https://notificationsounds.com/sound-effects/chafing-494 CC-attribution licence
  { filename: 'engine', url: 'engine.mp3' },  // https://notificationsounds.com/message-tones/engine-391 CC-attribution licence
];

const songs = [
  { filename: '03_My_Song_For_January.mp3', notes: 'this is a song i wrote about january and the feelings it gives me (not really, it is creative commons licensed music actually)', length: 452, playcount: 15, title: 'My Song for January' },
  { filename: '436dde4d-b90d-4bde-8d14-68fc05821cb7.webm', notes: 'Just testing my microphone and thought you might like to hear it', length: 4, playcount: 3, title: 'Ambient Noise' }, // Just one of our garbage noisy mixdowns from testing
];

const comments = [
  { text: 'This song is great' },
  { text: 'This song is beautiful' },
  { text: 'This song moved me to tears' },
  { text: 'This is great' },
  { text: 'This song reminds me of another song but I don\'t know which?' },
  { text: 'It sucks... when this song is over!! Soundcrowd, add a repeat feature!!' },
  { text: 'This song proves that the artist(s) are genius(es)!' },
  { text: 'This song is the bomb' },
];

db.sync({ force: true })
  .then(()=> Promise.all(files.map(file => Soundfile.create(file))))
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
  .catch(console.error.bind(console));