import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';
import { PlaybackControls, TrackList } from '../components';
import context from '../context';
import { setTime } from '../project-store/reducers/timeline/time';
import { setFiles, setFilesThunk } from '../project-store/reducers/files';
import { setClips, setClipsThunk } from '../project-store/reducers/clips';
import { setTracks, setTracksThunk } from '../project-store/reducers/tracks';
import { createSoundClips } from '../project-store/reducers/timeline/soundClips';
import { play, pause, playThunk } from '../project-store/reducers/timeline/isPlaying';
import { setPlayedAt, setPlayedAtThunk } from '../project-store/reducers/timeline/playedAt';
import { setStartThunk } from '../project-store/reducers/timeline/start';
import { setTempo } from '../project-store/reducers/settings/tempo';
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
    this.clipsRef = firebase.database().ref(`${this.props.projectId}/clips`);
    this.filesRef = firebase.database().ref(`${this.props.projectId}/files`);
    this.tracksRef = firebase.database().ref(`${this.props.projectId}/tracks`);
    this.settingsRef = firebase.database().ref(`${this.props.projectId}/settings`);
  }

  componentDidMount() {
    // calling createSoundClips here for testing purposes, but will need to be done after project files array is retrieved
    const { setFiles, setFilesThunk, setClips, setClipsThunk, setTracks, setTracksThunk, setTempo, createSoundClips, clips, projectId, files, soundClips } = this.props;

    // subscribe redux to firebase
    this.filesRef.on('value', snapshot => {
      setFiles(snapshot.val());
      // createSoundClips checks for new files, gets them, and puts the audio buffer in the soundClips object
      createSoundClips(snapshot.val(), soundClips);
    });
    this.clipsRef.on('value', snapshot => {
      setClips(snapshot.val());
    });
    this.tracksRef.on('value', snapshot => {
      setTracks(snapshot.val());
    });
    this.settingsRef.on('value', snapshot => {
      setTempo(snapshot.val());
    });

    // start firebase seeding
    setFilesThunk(projectId, [
      { id: 1, url: '/NotATumah.mp3' },
      { id: 2, url: '/GetToDaChoppa.mp3' },
    ]);
    setClipsThunk(projectId, [
      { fileId: 2, startTime: 2, track: 2 },
      { fileId: 1, startTime: 0, track: 1 },
    ]);
    setTracksThunk(projectId, [
      { id: 1, volume: 100, isMuted: false },
    ]);
    setTempo(60);
    // end firebase seeding
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
    clips.forEach(clip => {
      if (isPlaying === true && time > clip.startTime) {
        const soundClip = soundClips[clip.fileId];
        if (soundClip.played === false) {
          soundClip.played = true;
          const playAt = context.currentTime + (clip.startTime - time);
          this.playSound(soundClip.sound.buffer, time - clip.startTime, playAt);
        }
      }
    });
  }

  render() {
    const { clips, tracks, time } = this.props;
    return (
      <div style={{ position: 'relative', overflowX: 'scroll' }}>
        <PlaybackControls togglePlay={this.togglePlay} />
        <TrackList tracks={tracks} clips={clips} />
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
}};

const mapDispatch = dispatch => ({
  setTime: (time) => dispatch(setTime(time)),
  setFiles: (files) => dispatch(setFiles(files)),
  setFilesThunk: (projectId, files) => dispatch(setFilesThunk(projectId, files)),
  setClips: (clips) => dispatch(setClips(clips)),
  setClipsThunk: (projectId, clips) => dispatch(setClipsThunk(projectId, clips)),
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  setTracksThunk: (projectId, tracks) => dispatch(setTracksThunk(projectId, tracks)),
  setTempo: (tempo) => dispatch(setTempo(tempo)),
  createSoundClips: (files, soundClips) => dispatch(createSoundClips(files, soundClips)),
  play: () => dispatch(play()),
  playThunk: () => dispatch(playThunk()),
  pause: () => dispatch(pause()),
  setPlayedAt: time => dispatch(setPlayedAt(time)),
  setPlayedAtThunk: time => dispatch(setPlayedAtThunk(time)),
  setStartThunk: start => dispatch(setStartThunk(start)),
});

export default connect(mapState, mapDispatch)(Timeline);

/**
 * PROP TYPES
 */
Timeline.propTypes = {
  clips: PropTypes.arrayOf(PropTypes.object).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
