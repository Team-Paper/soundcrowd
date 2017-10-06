import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { PlaybackControls, TrackList } from '../components';
import context from '../context';
import getUserMedia from '../getUserMedia';
import { createWaveform } from '../waveformBuilder';
import { setTime } from '../project-store/reducers/timeline/time';
import { setFiles, setFilesThunk, addFileThunk } from '../project-store/reducers/files';
import { setClips, setClipsThunk, addClipThunk } from '../project-store/reducers/clips';
import { setTracks, setTracksThunk } from '../project-store/reducers/tracks';
import { fetchReverbsThunk } from '../project-store/reducers/reverbs';
import { createSoundClips, setWaveform } from '../project-store/reducers/timeline/soundClips';
import { play, pause, playThunk } from '../project-store/reducers/timeline/isPlaying';
import { startRecord, stopRecord } from '../project-store/reducers/timeline/isRecording';
import { setPlayedAt, setPlayedAtThunk } from '../project-store/reducers/timeline/playedAt';
import { setStartThunk } from '../project-store/reducers/timeline/start';
import { setStartRecordTime } from '../project-store/reducers/timeline/startRecordTime';
import { setSelectedTracks } from '../project-store/reducers/timeline/selectedTracks';
import { setLength, setLengthThunk } from '../project-store/reducers/settings/length';
import { setTempo, setTempoThunk } from '../project-store/reducers/settings/tempo';
import firebase from '../../firebase';

class Timeline extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playing: [],
      reverbBuffers: [],
    }
    this.checkAndPlay = this.checkAndPlay.bind(this);
    this.playSound = this.playSound.bind(this);
    this.tick = this.tick.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.mixdown = this.mixdown.bind(this);
    this.trackEffectsLoop = this.trackEffectsLoop.bind(this);
    this.clipsRef = firebase.database().ref(`${this.props.projectId}/clips`);
    this.filesRef = firebase.database().ref(`${this.props.projectId}/files`);
    this.tracksRef = firebase.database().ref(`${this.props.projectId}/tracks`);
    this.tempoRef = firebase.database().ref(`${this.props.projectId}/settings/tempo`);
    this.lengthRef = firebase.database().ref(`${this.props.projectId}/settings/length`);
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  componentDidMount() {
    // calling createSoundClips here for testing purposes, but will need to be done after project files array is retrieved
    const { setFiles, setFilesThunk, addFileThunk, setClips, setClipsThunk, setTracks, setTracksThunk, setTempo, setTempoThunk, createSoundClips, setWaveform, clips, projectId, files, soundClips, addClipThunk, selectedTracks, length, setLengthThunk, setLength, tempo, fetchReverbsThunk } = this.props;

    // subscribe redux to firebase
    this.filesRef.on('value', snapshot => {
      const received = snapshot.val();
      setFiles(Object.assign({}, received));
      // createSoundClips checks for new files, gets them, and puts the audio buffer in the soundClips object
      console.log('received files are', snapshot.val());
      createSoundClips(received, soundClips)
        .then(buffers => buffers.forEach(([id, audio]) => {
          setWaveform(id, createWaveform(audio));
        }));
    });
    this.clipsRef.on('value', snapshot => {
      const received = snapshot.val();
      setClips(Object.assign({}, received));
    });
    this.tracksRef.on('value', snapshot => {
      const received = snapshot.val();
      setTracks(Object.assign({}, received));
    });
    this.tempoRef.on('value', snapshot => {
      const received = snapshot.val();
      setTempo(received);
    });
    this.lengthRef.on('value', snapshot => {
      const received = snapshot.val();
      setLength(received);
    });

    // start firebase seeding
    // setFilesThunk(projectId, [
    //   { id: 1, url: '/NotATumah.mp3' },
    //   { id: 2, url: '/GetToDaChoppa.mp3' },
    // ]);
    // setClipsThunk(projectId, [
    //   { fileId: 2, startTime: 2, track: 2 },
    //   { fileId: 1, startTime: 0, track: 1 },
    // ]);
    setTracksThunk(projectId, [
      { id: 1, volume: 100, isMuted: false,
        reverb: { id: 1, on: false, gain: 1 },
        eq: {
          on: false,
          bands: {
            1: { f: 63, q: 4.318, gain: 0},
            2: { f: 125, q: 4.318, gain: 0},
            3: { f: 250, q: 4.318, gain: 0},
            4: { f: 400, q: 4.318, gain: 0},
            5: { f: 630, q: 4.318, gain: 0},
            6: { f: 1000, q: 4.318, gain: 0},
            7: { f: 1600, q: 4.318, gain: 0},
            8: { f: 2500, q: 4.318, gain: 0},
            9: { f: 4000, q: 4.318, gain: 0},
            10: { f: 6300, q: 4.318, gain: 0},
            11: { f: 10000, q: 4.318, gain: 0},
            12: { f: 16000, q: 4.318, gain: 0},
          }
        },
        compressor:{
          on: false,
          threshold: -24,
          knee: 30,
          ratio: 12,
          attack: 0.003,
          release: 0.25,
        }
      },
      { id: 2, volume: 100, isMuted: false,
        reverb: { id: 1, on: false, gain: 1 },
        eq: {
          on: false,
          bands: {
            1: { f: 63, q: 4.318, gain: 0},
            2: { f: 125, q: 4.318, gain: 0},
            3: { f: 250, q: 4.318, gain: 0},
            4: { f: 400, q: 4.318, gain: 0},
            5: { f: 630, q: 4.318, gain: 0},
            6: { f: 1000, q: 4.318, gain: 0},
            7: { f: 1600, q: 4.318, gain: 0},
            8: { f: 2500, q: 4.318, gain: 0},
            9: { f: 4000, q: 4.318, gain: 0},
            10: { f: 6300, q: 4.318, gain: 0},
            11: { f: 10000, q: 4.318, gain: 0},
            12: { f: 16000, q: 4.318, gain: 0},
          }
        },
        compressor:{
          on: false,
          threshold: -24,
          knee: 30,
          ratio: 12,
          attack: 0.003,
          release: 0.25,
        }
      },
    ]);
    // end firebase seeding

    // start listening for recording events
    if (getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.getUserMedia({ audio: true},
        stream => {
          this.mediaRecorder = new MediaRecorder(stream);

          this.mediaRecorder.ondataavailable = e => {
            this.audioChunks.push(e.data);
          }

          this.mediaRecorder.onstop = e => {
            console.log('recorder stopped');
            const blob = new Blob(this.audioChunks, { type: 'audio/ogg; codecs=opus'})
            this.audioChunks = [];
            console.log('blob is', blob);

            const formData = new FormData();
            formData.set('blob', blob);
            axios({
              method: 'post',
              url: '/api/soundfiles',
              headers: { 'Content-Type': 'multipart/form-data' },
              data: formData,
            })
              .then(res => res.data)
              .then((file) => {
                addFileThunk(projectId, file);
                addClipThunk(
                  projectId,
                  file.id,
                  this.props.selectedTracks,
                  this.props.startRecordTime,
                );
              })
              .catch(console.error);
            // const audioURL = window.URL.createObjectURL(blob);
            // audio.src = audioURL;
          }

      }, err => console.error(err));
    } else {
      console.log('getUserMedia not supported.');
    }
    // end recording section

    // get reverbs and store them on state
    const reverbs = {
      1: { id: 1, filename: '1st_baptist_nashville_far_close.wav', title: 'Nashville Church' }
      // 1: { id: 1, filename: '2346b5d7ba4918cb48d33f8669ea2389', title: 'test' }
    }
    fetchReverbsThunk(reverbs);
  }

  componentWillUnmount() {
    this.clipsRef.off();
    this.tracksRef.off();
    this.filesRef.off();
    this.settingsRef.off();
  }

  playSound(buffer, startTime, playAt, track) {
    console.log('played sound track is', track);
    const source = context.createBufferSource();
    if (!startTime) {
      startTime = 0;
    }
    source.buffer = buffer;
    this.trackEffectsLoop(source, track, context).connect(context.destination);
    source.start(playAt, startTime);
    this.setState({ playing: this.state.playing.concat(source) });
  }

  trackEffectsLoop(source, track, loopContext) {
    const { reverbs } = this.props;
    // effects loop settings
    // track volume settings
    const gainNode = loopContext.createGain();
    gainNode.gain.value = track.volume / 100;
    if (track.isMuted) {
      gainNode.gain.value = 0;
    }

    // eq settings
    const eqBand01 = loopContext.createBiquadFilter();
    eqBand01.type = 'lowshelf';
    eqBand01.frequency.value = 120;
    eqBand01.gain.value = track.eq.bands[1].gain; // in dBs

    const eqBand02 = loopContext.createBiquadFilter();
    eqBand02.type = 'peaking';
    eqBand02.frequency.value = 600;
    eqBand02.Q.value = track.eq.bands[2].q;
    eqBand02.gain.value = track.eq.bands[2].gain;

    const eqBand03 = loopContext.createBiquadFilter();
    eqBand03.type = 'peaking';
    eqBand03.frequency.value = 1000;
    eqBand03.Q.value = track.eq.bands[3].q;
    eqBand03.gain.value = track.eq.bands[3].gain;

    const eqBand04 = loopContext.createBiquadFilter();
    eqBand04.type = 'peaking';
    eqBand04.frequency.value = 1000;
    eqBand04.Q.value = track.eq.bands[4].q;
    eqBand04.gain.value = track.eq.bands[4].gain;

    const eqBand05 = loopContext.createBiquadFilter();
    eqBand05.type = 'peaking';
    eqBand05.frequency.value = 1000;
    eqBand05.Q.value = track.eq.bands[5].q;
    eqBand05.gain.value = track.eq.bands[5].gain;

    const eqBand06 = loopContext.createBiquadFilter();
    eqBand06.type = 'peaking';
    eqBand06.frequency.value = 1000;
    eqBand06.Q.value = track.eq.bands[6].q;
    eqBand06.gain.value = track.eq.bands[6].gain;

    const eqBand07 = loopContext.createBiquadFilter();
    eqBand07.type = 'peaking';
    eqBand07.frequency.value = 1000;
    eqBand07.Q.value = track.eq.bands[7].q;
    eqBand07.gain.value = track.eq.bands[7].gain;

    const eqBand08 = loopContext.createBiquadFilter();
    eqBand08.type = 'peaking';
    eqBand08.frequency.value = 1000;
    eqBand08.Q.value = track.eq.bands[8].q;
    eqBand08.gain.value = track.eq.bands[8].gain;

    const eqBand09 = loopContext.createBiquadFilter();
    eqBand09.type = 'peaking';
    eqBand09.frequency.value = 1000;
    eqBand09.Q.value = track.eq.bands[9].q;
    eqBand09.gain.value = track.eq.bands[9].gain;

    const eqBand10 = loopContext.createBiquadFilter();
    eqBand10.type = 'peaking';
    eqBand10.frequency.value = 1000;
    eqBand10.Q.value = track.eq.bands[10].q;
    eqBand10.gain.value = track.eq.bands[10].gain;

    const eqBand11 = loopContext.createBiquadFilter();
    eqBand11.type = 'peaking';
    eqBand11.frequency.value = 1000;
    eqBand11.Q.value = track.eq.bands[11].q;
    eqBand11.gain.value = track.eq.bands[11].gain;

    const eqBand12 = loopContext.createBiquadFilter();
    eqBand12.type = 'highshelf';
    eqBand12.frequency.value = 1000;
    eqBand12.Q.value = track.eq.bands[12].q;
    eqBand12.gain.value = track.eq.bands[12].gain;

    if (!track.eq.on) {
      eqBand01.gain.value = 0;
      eqBand02.gain.value = 0;
      eqBand03.gain.value = 0;
      eqBand04.gain.value = 0;
      eqBand05.gain.value = 0;
      eqBand06.gain.value = 0;
      eqBand07.gain.value = 0;
      eqBand08.gain.value = 0;
      eqBand09.gain.value = 0;
      eqBand10.gain.value = 0;
      eqBand11.gain.value = 0;
      eqBand12.gain.value = 0;
    }

    // compression settings
    const compressionNode = loopContext.createDynamicsCompressor();
    compressionNode.threshold.value = track.compressor.threshold;
    compressionNode.knee.value = track.compressor.knee;
    compressionNode.ratio.value = track.compressor.ratio;
    compressionNode.attack.value = track.compressor.attack;
    compressionNode.release.value = track.compressor.release;

    // reverb settings
    const convolverNode = loopContext.createConvolver();
    const convolverGain = loopContext.createGain();
    convolverNode.buffer = reverbs['1'].audio.buffer;
    convolverGain.gain.value = track.reverb.gain;
    if (!track.reverb.on) {
      convolverGain.gain.value = 0;
    }

    // effects chain
    source.connect(eqBand01);
    eqBand01.connect(eqBand02);
    eqBand02.connect(eqBand03);
    eqBand03.connect(eqBand04);
    eqBand04.connect(eqBand05);
    eqBand05.connect(eqBand06);
    eqBand06.connect(eqBand07);
    eqBand07.connect(eqBand08);
    eqBand08.connect(eqBand09);
    eqBand09.connect(eqBand10);
    eqBand10.connect(eqBand11);
    eqBand11.connect(eqBand12);
    if (track.compressor.on) {
      eqBand12.connect(compressionNode);
      compressionNode.connect(convolverGain);
    } else {
      eqBand12.connect(convolverGain);
    }
    convolverGain.connect(convolverNode);
    convolverNode.connect(gainNode);
    if (track.compressor.on) {
      eqBand12.connect(compressionNode);
      compressionNode.connect(gainNode);
    } else {
      eqBand12.connect(gainNode);
    }

    return gainNode;
  }

  togglePlay() {
    console.log('playing toggled')
    const { isPlaying, play, pause, setPlayedAt, setPlayedAtThunk, soundClips, playThunk, setStartThunk, time, clips, isRecording, stopRecord } = this.props;
    if (!isPlaying) {
      setStartThunk(time)
        .then(() => playThunk())
        .then(() => setPlayedAtThunk(context.currentTime))
        .then(() => this.tick())
        .catch(console.error);
        // setTimeout(this.tick, 20);
    } else {
      if (isRecording) {
        console.log('mediarecorder state is', this.mediaRecorder.state);
        this.mediaRecorder.stop();
        stopRecord();
      }
      pause();
      this.state.playing.forEach(sound => {
        sound.stop();
      });
      for (let key in clips) {
        if (clips.hasOwnProperty(key)) {
          clips[key].played = false;
        }
      }
      this.setState({ playing: [] });
    }
  }

  tick() {
    const { time, playedAt, start, setTime, isPlaying, tempo, isRecording } = this.props;
    setTime((context.currentTime - playedAt) + start);
    const timeSubDivide = 60 / tempo;
    this.checkAndPlay(time);
    if (this.mediaRecorder.state !== 'recording' && isRecording) {
      setTimeout(() => this.mediaRecorder.start(), 40);
    }
    isPlaying && setTimeout(this.tick, 0);
  }

  checkAndPlay(time) {
    const { soundClips, isPlaying, clips, tracks } = this.props;
    for (let key in clips) {
      if (clips.hasOwnProperty(key)) {
        const clip = clips[key];
        if (isPlaying === true && time > clip.startTime && clip.track !== null && clip.played === false) {
          const track = tracks[clip.track];
          const soundClip = soundClips[clip.fileId];
          const playAt = context.currentTime + (clip.startTime - time);
          clip.played = true;
          this.playSound(soundClip.sound.buffer, time - clip.startTime, playAt, track);
        }
      }
    }
  }

  startRecord() {
    const { time, selectedTracks, setStartRecordTime, isPlaying, isRecording, startRecord } = this.props;
    if (!selectedTracks.length || isRecording) return;
    startRecord();
    console.log('startRecordTime should be', time);
    setStartRecordTime(time);
    if (!isPlaying) {
      this.togglePlay();
    }
    console.log('mediaRecorder state is', this.mediaRecorder.state);
    console.log('recorder started');
  }

  stopRecord() {
    const { isRecording, stopRecord, isPlaying } = this.props;
    if (!isRecording) return;
    stopRecord();
    if (isPlaying) {
      this.togglePlay(); //togglePlay will call this.mediaRecorder.stop();
    }
    console.log('mediaRecorder state is', this.mediaRecorder.state);
    console.log('recorder stopped');
  }

  mixdown() {
    const { clips, soundClips, length, tracks } = this.props;
    const offlineContext = new OfflineAudioContext(2, length * 44100, 44100); // hardcoded to stereo, length 300 seconds?
    const chunks = [];

    offlineContext.oncomplete = e => {
      const source = context.createBufferSource();
      const dest = context.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream);

      source.buffer = e.renderedBuffer; // this is the mixed-down audio buffer
      source.connect(dest); // this connects the mixed-down buffer to the mediaRecorder

      mediaRecorder.ondataavailable = e => {
        console.log('data available');
        chunks.push(e.data);
      }

      mediaRecorder.onstop = e => {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus'});
        const formData = new FormData();

        formData.set('blob', blob);
        axios({
          method: 'post',
          url: '/api/songs',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        })
          .then(res => res.data)
          .then(file => {
            console.log('mixdown upload received!');
          })
          .catch(console.error);
      }

      mediaRecorder.start();
      source.start(0);
      setTimeout(() => mediaRecorder.stop(), (length * 1000));
    }

    Promise.all(Object.entries(clips).map(([key, clip]) => {
      console.log('clip is', clip);
      if (clip.track === null) {
        return;
      }
      const track = tracks[clip.track];
      const newBufferSource = offlineContext.createBufferSource();
      const soundClip = soundClips[clip.fileId];
      console.log('soundClip is', soundClip);
      newBufferSource.buffer = soundClip.sound.buffer;
      this.trackEffectsLoop(newBufferSource, track, offlineContext).connect(offlineContext.destination);
      newBufferSource.start(clip.startTime);
    }))
      .then(() => offlineContext.startRendering())

    const splitter = context.createChannelMerger(clips.length);
  }

  render() {
    const { projectId, tracks, time, setLengthThunk, length } = this.props;
    return (
      <div style={{ position: 'relative', overflowX: 'scroll' }}>
        <div>{time}</div>
        <button onClick={this.startRecord}>record</button>
        <button onClick={this.stopRecord}>stop</button>
        <button onClick={this.mixdown}>mixdown</button>
        <span>length (seconds):</span>
        <input type="text" value={length} onChange={e => setLengthThunk(projectId, e.target.value)} />
        <PlaybackControls togglePlay={this.togglePlay} />
        <TrackList project={Number(projectId)} tracks={tracks} />
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  return {
  projectId: ownProps.match.params.id,
  time: state.timeline.time,
  playedAt: state.timeline.playedAt,
  start: state.timeline.start,
  tempo: state.settings.tempo,
  isPlaying: state.timeline.isPlaying,
  soundClips: state.timeline.soundClips,
  files: state.files,
  clips: state.clips,
  tracks: state.tracks,
  selectedTracks: state.timeline.selectedTracks,
  startRecordTime: state.timeline.startRecordTime,
  length: state.settings.length,
  reverbs: state.reverbs,
  isRecording: state.timeline.isRecording,
}};

const mapDispatch = dispatch => ({
  setTime: (time) => dispatch(setTime(time)),
  setFiles: (files) => dispatch(setFiles(files)),
  setFilesThunk: (projectId, files) => dispatch(setFilesThunk(projectId, files)),
  addFileThunk: (projectId, file) => dispatch(addFileThunk(projectId, file)),
  setClips: (clips) => dispatch(setClips(clips)),
  setClipsThunk: (projectId, clips) => dispatch(setClipsThunk(projectId, clips)),
  addClipThunk: (projectId, fileId, selectedTracks, time) => dispatch(addClipThunk(projectId, fileId, selectedTracks, time)),
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  setTracksThunk: (projectId, tracks) => dispatch(setTracksThunk(projectId, tracks)),
  setTempo: (tempo) => dispatch(setTempo(tempo)),
  setTempoThunk: (projectId, tempo) => dispatch(setTempoThunk(projectId, tempo)),
  createSoundClips: (files, soundClips) => dispatch(createSoundClips(files, soundClips)),
  setWaveform: (fileId, waveform) => dispatch(setWaveform(fileId, waveform)),
  play: () => dispatch(play()),
  playThunk: () => dispatch(playThunk()),
  pause: () => dispatch(pause()),
  setPlayedAt: time => dispatch(setPlayedAt(time)),
  setPlayedAtThunk: time => dispatch(setPlayedAtThunk(time)),
  setStartThunk: start => dispatch(setStartThunk(start)),
  setSelectedTracks: selectedTracks => dispatch(setSelectedTracks(selectedTracks)),
  setStartRecordTime: time => dispatch(setStartRecordTime(time)),
  setLength: length => dispatch(setLength(length)),
  setLengthThunk: (projectId, length) => dispatch(setLengthThunk(projectId, length)),
  fetchReverbsThunk: reverbs => dispatch(fetchReverbsThunk(reverbs)),
  startRecord: () => dispatch(startRecord()),
  stopRecord: () => dispatch(stopRecord()),
});

export default connect(mapState, mapDispatch)(Timeline);
