import React from 'react';
import { connect } from 'react-redux';
import context from '../context';
import { Grid, Header, List, Segment } from 'semantic-ui-react';

class Timeline extends React.Component {

  playSound() {

  }

  togglePlay() {


  }

  addSoundClip() {

    // dispatch something
  }

  tick() {

  }

  checkAndPlay() {

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

})

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Timeline);
