import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, List } from 'semantic-ui-react';
import { Timeline } from '../components';

const styles = {
  listItem: {
    background: '#22a3ef',
    cursor: 'move',
    marginBottom: '1em',
    overflow: 'hidden',
  },
};


/**
 * COMPONENT
 */
export const DAW = (props) => {
  const { name, files, settings } = props;
  return (
    <Grid divided padded>
      <Grid.Column width={3}>
        <Header as="h3">{name}</Header>
        <p>Tempo: {settings.tempo}</p>
        <List>
          {files.map(item => (
            <List.Item
              style={styles.listItem}
              key={item.id}
            >
              {item.filename}
            </List.Item>
          ))}
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
const mapState = state => ({
  name: 'Current Project',
  files: Object.entries(state.files).map(entry => entry[1]),
  settings: { tempo: 60, isMetronomeOn: false },
});


export default connect(mapState)(DAW);

