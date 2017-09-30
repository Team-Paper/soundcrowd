import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';
import { PlaybackControls } from '../components';
import context from '../context';
import { setTime } from '../project-store/reducers/timeline/time';
import { setFiles, setFilesThunk } from '../project-store/reducers/files';
import { setClips, setClipsThunk } from '../project-store/reducers/clips';
import { setTracks } from '../project-store/reducers/tracks';
import { createSoundClips, removeSoundClip } from '../project-store/reducers/timeline/soundClips';
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
    const { setFiles, setFilesThunk, setClips, setClipsThunk, setTracks, setTempo, createSoundClips, clips, projectId } = this.props;



    // these should be as a result of a 'create' function, not in componentDidMount
    // this.filesRef.set([
    //   { id: 1, url: '/NotATumah.mp3' },
    //   { id: 2, url: '/GetToDaChoppa.mp3' },
    // ]);

    // subscribe redux to firebase here
    this.filesRef.on('value', snapshot => {
      setFiles(snapshot.val());
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

    setFilesThunk(projectId, [
      { id: 1, url: '/NotATumah.mp3' },
      { id: 2, url: '/GetToDaChoppa.mp3' },
    ])
    setClipsThunk(projectId, [
      { url: '/GetToDaChoppa.mp3', startTime: 2, track: null },
      { url: '/NotATumah.mp3', startTime: 0, track: 1 },
    ])
    setTracks([
      { id: 1, volume: 100, isMuted: false },
    ])
    setTempo(60);
    createSoundClips(clips);

    // these test playing and pausing
    // setTimeout(() => this.togglePlay(), 1000);
    // setTimeout(() => this.togglePlay(), 3000);
  }

  componentWillUnmount() {
    this.filesRef.off();
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
        .then(() => console.log('isPlaying is', isPlaying))
        // .then(() => this.tick())
        .catch(console.error);
        setTimeout(this.tick, 20);
    } else {
      pause();
      this.state.playing.forEach(sound => {
        sound.stop();
      });
      soundClips.forEach(soundClip => {
        soundClip.played = false;
      })
      this.setState({ playing: [] });
    }
  }

  tick() {
    const { time, playedAt, start, setTime, isPlaying, tempo } = this.props;
    // const now = (context.currentTime - playedAt) + start
    setTime((context.currentTime - playedAt) + start);
    const timeSubDivide = 60 / tempo;
    this.checkAndPlay(time);
    // console.log('time is', time);
    isPlaying && setTimeout(this.tick, 0);
  }

  checkAndPlay(time) {
    const { soundClips, removeSoundClip, isPlaying } = this.props;
    // console.log('soundClips are', soundClips);
    // console.log('checked!');
    soundClips.forEach((soundClip, index) => {
      // console.log('time is ', time, 'and startTime is', soundClip.time)
      if (soundClip.played === false && isPlaying === true && time > soundClip.time) {
        soundClip.played = true;
        const playAt = context.currentTime + (soundClip.time - time);
        this.playSound(soundClip.sound.buffer, time - soundClip.time, playAt);
        console.log('sound played at', time);
      }
    });
  }

  render() {
    const { clips, tracks, time } = this.props;
    return (
      <div>
        <div>time: { time }</div>
        <PlaybackControls togglePlay={this.togglePlay} />
        { tracks.map((track, index) => (
          <Grid key={track.id}>
            <Grid.Column width={2}>
              Track #{index + 1}
            </Grid.Column>
            <Grid.Column width={14}>
              <Segment.Group horizontal>
                {
                  clips.filter(clip => clip.track === track.id)
                    .map(clip => <Segment key={clip.url}>{clip.url} starting at {clip.startTime}</Segment>)
                }
              </Segment.Group>
            </Grid.Column>
          </Grid>
        )) }
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  console.log('Timeline ownProps is', ownProps);
  return {
  projectId: ownProps.match.params.id,
  time: state.timeline.time,
  playedAt: state.timeline.playedAt,
  start: state.timeline.start,
  tempo: state.settings.tempo,
  isPlaying: state.timeline.isPlaying,
  soundClips: state.timeline.soundClips,
  files: state.files,
  clips: [
    { url: '/GetToDaChoppa.mp3', startTime: 2, track: null },
    { url: '/NotATumah.mp3', startTime: 0, track: 1 },
  ],
  tracks: [
    { id: 1, volume: 100, isMuted: false },
  ],
}};

const mapDispatch = dispatch => ({
  setTime: (time) => dispatch(setTime(time)),
  setFiles: (files) => dispatch(setFiles(files)),
  setFilesThunk: (projectId, files) => dispatch(setFilesThunk(projectId, files)),
  setClips: (clips) => dispatch(setClips(clips)),
  setClipsThunk: (projectId, clips) => dispatch(setClipsThunk(projectId, clips)),
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  setTempo: (tempo) => dispatch(setTempo(tempo)),
  createSoundClips: (files) => dispatch(createSoundClips(files)),
  removeSoundClip: soundClip => dispatch(removeSoundClip(soundClip)),
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
