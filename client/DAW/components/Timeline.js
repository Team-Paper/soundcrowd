import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';
import { PlaybackControls } from '../components';
import context from '../context';
import { setTime } from '../project-store/reducers/timeline/time';
import { setFiles } from '../project-store/reducers/files';
import { createSoundClips, removeSoundClip } from '../project-store/reducers/timeline/soundClips';

class Timeline extends React.Component {
  constructor(props){
    super(props);
    this.checkAndPlay = this.checkAndPlay.bind(this);
    this.playSound = this.playSound.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    // calling createSoundClips here for testing purposes, but will need to be done after project files array is retrieved
    const { setFiles, createSoundClips, clips } = this.props;
    setFiles([
      { id: 1, url: '/NotATumah.mp3' },
      { id: 2, url: '/GetToDaChoppa.mp3' },
    ])
    createSoundClips(clips);

    setTimeout(() => this.tick(), 2000);
  }

  playSound(buffer, startTime) {
    const source = context.createBufferSource();
    if (!startTime) {
      startTime = 0;
    }
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0, startTime);
  }

  togglePlay() {
    // toggle tick
    // dispatch...
  }

  addSoundClip() {

    // dispatch something
  }

  tick() {
    const { time, playedAt, start, setTime, isPlaying, tempo } = this.props;
    // const now = (context.currentTime - playedAt) + start
    setTime((context.currentTime - playedAt) + start);
    const timeSubDivide = 60 / tempo;
    this.checkAndPlay(time);
    // console.log('time is', time);
    setTimeout(this.tick, 0);
  }

  checkAndPlay(time) {
    const { soundClips, removeSoundClip } = this.props;
    // console.log('soundClips are', soundClips);
    // console.log('checked!');
    soundClips.forEach((soundClip, index) => {
      // console.log('time is ', time, 'and startTime is', soundClip.time)
      if (time > soundClip.time) {
        this.playSound(soundClip.sound.buffer, this.time - soundClip.time);
        removeSoundClip(soundClip);
        console.log('sound played at', time);
      }
    });
  }

  render() {
    const { clips, tracks } = this.props;
    return (
      <div>
        <PlaybackControls />
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

const mapState = (state, ownProps) => ({
  time: state.timeline.time,
  playedAt: state.timeline.playedAt,
  start: state.timeline.start,
  tempo: state.settings.tempo,
  isPlaying: state.timeline.isPlaying,
  soundClips: state.timeline.soundClips,
  files: state.files,
  clips: [
    { url: '/GetToDaChoppa.mp3', startTime: 4, track: null },
    { url: '/NotATumah.mp3', startTime: 3, track: 1 },
  ],
  tracks: [
    { id: 1, volume: 100, isMuted: false },
  ],
});

const mapDispatch = dispatch => ({
  setTime: (time) => dispatch(setTime(time)),
  setFiles: (files) => dispatch(setFiles(files)),
  createSoundClips: (files) => dispatch(createSoundClips(files)),
  removeSoundClip: soundClip => dispatch(removeSoundClip(soundClip)),
});

export default connect(mapState, mapDispatch)(Timeline);

/**
 * PROP TYPES
 */
Timeline.propTypes = {
  clips: PropTypes.arrayOf(PropTypes.object).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
