import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';
import context from '../context';
import { setTime } from '../project-store/reducers/timeline/time';
import { setFiles } from '../project-store/reducers/files';
import { createSoundClips } from '../project-store/reducers/timeline/soundClips';

class Timeline extends React.Component {
  constructor(props){
    super(props);
    this.checkAndPlay = this.checkAndPlay.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    // calling createSoundClips here for testing purposes, but will need to be done after project files array is retrieved
    const { setFiles, createSoundClips } = this.props;
    setFiles([
      { id: 1, url: '/NotATumah.mp3' },
      { id: 2, url: '/GetToDaChoppa.mp3' },
    ])
    createSoundClips(files);
  }

  playSound(buffer, startTime) {
    const source = context.createBufferSource();
    if (!startTime) {
      startTime = 0;
    }
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(playTime, startTime);
  }

  togglePlay() {

  }

  addSoundClip() {

    // dispatch something
  }

  tick() {
    const { time, playedAt, start, setTime, isPlaying } = this.props;
    setTime((context.currentTime - playedAt) + start);
    const timeSubDivide = 60 / tempo;
    this.checkAndPlay(time);
  }

  checkAndPlay(time) {
    const { soundClips } = this.props;
    soundClips.forEach((soundClip, index) => {
      if (time > soundClip.time) {
        this.playSound(soundClip.sound.buffer, this.time - soundClip.time);
        console.log('sound played at', time);
      }
    });
  }

  render() {
    const { clips, tracks } = this.props;
    return (
      <div>
        { tracks.map((track, index) => (
          <Grid key={track.id}>
            <Grid.Column width={2}>
              Track #{index + 1}
            </Grid.Column>
            <Grid.Column width={14}>
              <Segment.Group horizontal>
                {
                  clips.filter(clip => clip.track === track.id)
                    .map(clip => <Segment>{clip.url} starting at {clip.startTime}</Segment>)
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
    { url: '/GetToDaChoppa.mp3', startTime: 0, track: null },
    { url: '/NotATumah.mp3', startTime: 0.5, track: 1 },
  ],
  tracks: [
    { id: 1, volume: 100, isMuted: false },
  ],
});

const mapDispatch = dispatch => ({
  setTime: () => dispatch(setTime()),
  setFiles: (files) => dispatch(setFiles(files)),
  createSoundClips: (files) => dispatch(createSoundClips(files)),
});

export default connect(mapState, mapDispatch)(Timeline);

/**
 * PROP TYPES
 */
Timeline.propTypes = {
  clips: PropTypes.arrayOf(PropTypes.object).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
