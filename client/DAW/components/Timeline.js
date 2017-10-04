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
import { createSoundClips } from '../project-store/reducers/timeline/soundClips';
import { play, pause, playThunk } from '../project-store/reducers/timeline/isPlaying';
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
    }
    this.checkAndPlay = this.checkAndPlay.bind(this);
    this.playSound = this.playSound.bind(this);
    this.tick = this.tick.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.mixdown = this.mixdown.bind(this);
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
    const { setFiles, setFilesThunk, addFileThunk, setClips, setClipsThunk, setTracks, setTracksThunk, setTempo, setTempoThunk, createSoundClips, clips, projectId, files, soundClips, addClipThunk, selectedTracks, length, setLengthThunk, setLength, tempo } = this.props;

    // subscribe redux to firebase
    this.filesRef.on('value', snapshot => {
      const received = snapshot.val();
      setFiles(Object.assign({}, received));
      // createSoundClips checks for new files, gets them, and puts the audio buffer in the soundClips object
      console.log('received files are', snapshot.val());
      createSoundClips(received, soundClips)
        .then(buffers => buffers.forEach(createWaveform));
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

    // if it's a new project and tempo/length is 0, set a default length/tempo
    if (length === 0) {
      setLengthThunk(projectId, 10);
    }
    if (tempo === 0) {
      setTempoThunk(projectId, 60);
    }

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
      { id: 1, volume: 100, isMuted: false },
      { id: 2, volume: 100, isMuted: false },
    ]);
    setTempo(60);
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
            const audio = document.querySelector('.audio');
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
  }

  componentWillUnmount() {
    this.clipsRef.off();
    this.tracksRef.off();
    this.filesRef.off();
    this.settingsRef.off();
  }

  playSound(buffer, startTime, playAt) {
    const source = context.createBufferSource();
    if (!startTime) {
      startTime = 0;
    }
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(playAt, startTime);
    this.setState({ playing: this.state.playing.concat(source) });
  }

  togglePlay() {
    console.log('playing toggled')
    const { isPlaying, play, pause, setPlayedAt, setPlayedAtThunk, soundClips, playThunk, setStartThunk, time } = this.props;
    if (!isPlaying) {
      setStartThunk(time)
        .then(() => playThunk())
        .then(() => setPlayedAtThunk(context.currentTime))
        .catch(console.error);
        setTimeout(this.tick, 20);
    } else {
      pause();
      this.state.playing.forEach(sound => {
        sound.stop();
      });
      for (let key in soundClips) {
        if (soundClips.hasOwnProperty(key)) {
          soundClips[key].played = false;
        }
      }
      this.setState({ playing: [] });
    }
  }

  tick() {
    const { time, playedAt, start, setTime, isPlaying, tempo } = this.props;
    setTime((context.currentTime - playedAt) + start);
    const timeSubDivide = 60 / tempo;
    this.checkAndPlay(time);
    isPlaying && setTimeout(this.tick, 0);
  }

  checkAndPlay(time) {
    const { soundClips, isPlaying, clips } = this.props;
    for (let key in clips) {
      if (clips.hasOwnProperty(key)) {
        const clip = clips[key];
        if (isPlaying === true && time > clip.startTime) {
          const soundClip = soundClips[clip.fileId];
          if (soundClip.played === false) {
            soundClip.played = true;
            const playAt = context.currentTime + (clip.startTime - time);
            this.playSound(soundClip.sound.buffer, time - clip.startTime, playAt);
          }
        }
      }
    }
  }

  startRecord() {
    const { time, selectedTracks, setStartRecordTime } = this.props;
    if (!selectedTracks.length) return;
    console.log('startRecordTime should be', time);
    setStartRecordTime(time);
    this.mediaRecorder.start();
    this.togglePlay();
    console.log('mediaRecorder state is', this.mediaRecorder.state);
    console.log('recorder started');
  }

  stopRecord() {
    this.mediaRecorder.stop();
    console.log('mediaRecorder state is', this.mediaRecorder.state);
    console.log('recorder stopped');
  }

  mixdown() {
    const { clips, soundClips, length } = this.props;
    const offlineContext = new OfflineAudioContext(2, length * 44100, 44100); // hardcoded to stereo, length 300 seconds?
    const chunks = [];

    offlineContext.oncomplete = e => {
      const source = context.createBufferSource();
      const dest = context.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream);

      source.buffer = e.renderedBuffer;
      source.connect(dest);

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
      const newBufferSource = offlineContext.createBufferSource();
      const soundClip = soundClips[clip.fileId];
      console.log('soundClip is', soundClip);
      newBufferSource.buffer = soundClip.sound.buffer;
      newBufferSource.connect(offlineContext.destination);
      newBufferSource.start(clip.startTime);
    }))
      .then(() => offlineContext.startRendering())


    const splitter = context.createChannelMerger(clips.length);
  }

  render() {
    const { projectId, tracks, time, setLength, length } = this.props;
    return (
      <div style={{ position: 'relative', overflowX: 'scroll' }}>
        <div>{time}</div>
        <button onClick={this.startRecord}>record</button>
        <button onClick={this.stopRecord}>stop</button>
        <button onClick={this.mixdown}>mixdown</button>
        <span>length (seconds):</span>
        <input type="text" value={length} onChange={e => setLength(e.target.value)} />
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
});

export default connect(mapState, mapDispatch)(Timeline);
