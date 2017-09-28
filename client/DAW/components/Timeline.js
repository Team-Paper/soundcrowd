import React from 'react';
import { connect } from 'react-redux';
import context from '../context';
import { Grid, Header, List, Segment } from 'semantic-ui-react';
import { setTime } from '../project-store/reducers/timeline/time';
import { setFiles } from '../project-store/reducers/files';

class Timeline extends React.Component {
  constructor(props){
    super(props);
    this.checkAndPlay = this.checkAndPlay.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  componentDidMount() {
    // calling createSoundClips here for testing purposes, but will need to be done after project files array is retrieved

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
};

const mapState = (state, ownProps) => ({
  time: state.timeline.time,
  playedAt: state.timeline.playedAt,
  start: state.timeline.start,
  tempo: state.settings.tempo,
  isPlaying: state.timeline.isPlaying,
  soundClips: state.timeline.soundClips,
  files: state.files,
});

const mapDispatch = dispatch => ({
  setTime: () => dispatch(setTime()),
  setFiles: ()

});

export default connect(mapState, mapDispatch)(Timeline);
