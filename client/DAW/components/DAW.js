import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, List } from 'semantic-ui-react';
import { Timeline, FileItem } from '../components';


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
            <FileItem key={item.id} item={item} />
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

