import React from 'react';
// import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

const Track = (props) => {
  const { index, clips } = props;
  return (
    <Grid>
      <Grid.Column width={2}>
        Track #{index + 1}
      </Grid.Column>
      <Grid.Column width={14}>
        <Segment.Group horizontal>
          { clips.map(clip => (
            <Segment key={clip.url}>
              {clip.url} starting at {clip.startTime}
            </Segment>
          )) }
        </Segment.Group>
      </Grid.Column>
    </Grid>
  );
};

export default Track;
