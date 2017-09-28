import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';
import context from '../context';

class Timeline extends React.Component {

//   playSound() {
//
//   }
//
//   togglePlay() {
//
//
//   }
//
//   addSoundClip() {
//
//     // dispatch something
//   }
//
//   tick() {
//
//   }
//
//   checkAndPlay() {
//
//   }

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
  clips: [
    { url: '/GetToDaChoppa.mp3', startTime: 0, track: null },
    { url: '/NotATumah.mp3', startTime: 0.5, track: 1 },
  ],
  tracks: [
    { id: 1, volume: 100, isMuted: false },
  ],
});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(Timeline);

/**
 * PROP TYPES
 */
Timeline.propTypes = {
  clips: PropTypes.arrayOf(PropTypes.object).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
