import axios from 'axios';

let project = {
  clips: [
    { url: '/GetToDaChoppa.mp3', startTime: 0, track: null },
    { url: '/NotATumah.mp3', startTime: .5, track: 1 }
  ],
  // clips: [
  //   { clipId: 1, startTime: 0, track: 1 }
  // ],
  library: [
    { id: 1, url: '/NotATumah.mp3' }
  ],
  tracks: [
    { id: 1, volume: 100, isMuted: false }
  ],
  settings: { tempo: 60, isMetronomeOn: false }
}

let context = new (window.AudioContext || window.webkitAudioContext)();
let Timeline = function(options) {
  this.tempo = options.tempo;
  this.soundClips = [];
  this.metronomeSound = {};
  this.isMetronomeOn = options.isMetronomeOn;
  this.beat = 0;
  this.pointer = 0;
  this.playedAt = null;
  this.isPlaying = false;
  this._tick = this.tick.bind(this);
  this.time = this.pointer;
}

let timeline;

Timeline.playSound = function(buffer, startTime) {
  let source = context.createBufferSource();
  if (!startTime) startTime = 0;
  console.log('startTime is', startTime)
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0, startTime);
}

Timeline.prototype.togglePlay = function() {
  console.log('toggling play');
  if (!this.isPlaying) {
    this.isPlaying = true;
    this.playedAt = context.currentTime;
    this._tick();
  } else {
    this.isPlaying = false;
    this.playedAt = null;
    // must cancel this_tick();
  }
}

Timeline.prototype.addSoundClip = function(fn) {
  this.soundClips.push(fn);
};

Timeline.prototype.addBeatSoundClip = function(soundObject) {
  this.metronomeSound = soundObject;
}

Timeline.prototype.tick = function() {
  let now = (context.currentTime - this.playedAt) + this.pointer;
  this.time = now;
  // this.pointer = now;

  const timeSubDivide = 60 / this.tempo;
  if (this.isMetronomeOn) {
    this.checkAndPlayClick(timeSubDivide);
  }
  // console.log('time is', this.time)
  // console.log('tick!');
  this.checkAndPlay(now);
  this.isPlaying && setTimeout(this._tick, 0);
};

Timeline.prototype.checkAndPlayClick = function(timeSubDivide) {
  if (this.time > this.beat * timeSubDivide && this.time > 1) { // the this.time > 1 is to let sound buffer load, lazy hack
    console.log('click', this.beat, this.time);
    Timeline.playSound(this.metronomeSound.sound.buffer);
    this.beat++;
  }
}

Timeline.prototype.checkAndPlay = function(now) {
  /* this may get inefficient for large arrays. ToDo: add lookahead scheduling to push onto this array just before time is scheduled, and have Timeline on a webworker so it never gets interrupted (per https://www.html5rocks.com/en/tutorials/audio/scheduling/)
  */
  this.soundClips.forEach((soundClip, index) => {
    if(now > soundClip.time) {
      // console.log('tempo is', this.tempo)
      // console.dir(soundClip.sound);
      Timeline.playSound(soundClip.sound.buffer, this.time - soundClip.time);
      this.soundClips.splice(index, 1);
      console.log('sound played at', now);
    }
  })
}

timeline = new Timeline(project.settings);

Promise.all(project.clips.map(clip => {
  return axios.get(clip.url, { responseType: 'arraybuffer' })
    .then(res => res.data)
    .then(responseAudio => {
      return context.decodeAudioData(responseAudio, audio => {
        let buffer = context.createBufferSource();
        console.log('decoding audio data');
        buffer.connect(context.destination);
        buffer.buffer = audio;
        timeline.addSoundClip({ sound: buffer, time: clip.startTime });
        timeline.addBeatSoundClip({ sound: buffer });
      })
    })
}))
  .then(() => {
    timeline.tempo = project.settings.tempo;
    setTimeout(() => timeline.togglePlay(), 1000);
  })
  .catch(console.error);
