import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, List } from 'semantic-ui-react';
import { Timeline } from '../components';
import context from '../context';

/**
 * COMPONENT
 */
export const DAW = (props) => {
  const { name, library, settings } = props;
  console.log('daw props are', props)
  return (
    <Grid divided>
      <Grid.Column width={3}>
        <Header as="h3">{name}</Header>
        <p>Tempo: {settings.tempo}</p>
        <List>
          { library.map(item => <List.Item key={item.id}>{item.url}</List.Item>) }
        </List>
      </Grid.Column>
      <Grid.Column width={13}>
        <Timeline {...props} />
      </Grid.Column>
    </Grid>
  );
};

/**
 * CONTAINER
 */
const mapState = (state, ownProps) =>
  // return state.project
  ({
    name: 'Current Project',
    library: [
      { id: 1, url: '/NotATumah.mp3' },
    ],
    settings: { tempo: 60, isMetronomeOn: false },
  });


export default connect(mapState)(DAW);

/**
 * PROP TYPES
 */
DAW.propTypes = {
  name: PropTypes.string.isRequired,
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  settings: PropTypes.shape({
    tempo: PropTypes.number,
    isMetronomeOn: PropTypes.bool,
  }).isRequired,
};
