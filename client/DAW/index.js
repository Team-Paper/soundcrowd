import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, List } from 'semantic-ui-react';

/**
 * COMPONENT
 */
export const DAW = (props) => {
  const { name, clips, library, tracks, settings } = props;

  return (
    <Grid divided>
      <Grid.Column width={3}>
        <Header as="h3">{name}</Header>
        <List>
          { library.map(item => <List.Item key={item.id}>{item.url}</List.Item>) }
        </List>
      </Grid.Column>
      <Grid.Column width={9}>
        Timeline Goes Here
      </Grid.Column>
    </Grid>
  );
};

/**
 * CONTAINER
 */
const mapState = () =>
  // return state.project
  ({
    name: 'Current Project',
    clips: [
      { url: '/GetToDaChoppa.mp3', startTime: 0, track: null },
      { url: '/NotATumah.mp3', startTime: 0.5, track: 1 },
    ],
    library: [
      { id: 1, url: '/NotATumah.mp3' },
    ],
    tracks: [
      { id: 1, volume: 100, isMuted: false },
    ],
    settings: { tempo: 60, isMetronomeOn: false },
  });


export default connect(mapState)(DAW);

/**
 * PROP TYPES
 */
DAW.propTypes = {
  name: PropTypes.string.isRequired,
  clips: PropTypes.array.isRequired,
  library: PropTypes.array.isRequired,
  tracks: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
};
