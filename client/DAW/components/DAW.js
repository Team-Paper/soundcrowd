import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, List, Card } from 'semantic-ui-react';
import { Timeline, FileItem } from '../components';


/**
 * COMPONENT
 */
export const DAW = (props) => {
  const { name, files, settings, projectId } = props;
  return (
    <Grid padded style={{ backgroundColor: '#eeeeee', height: '100%', marginTop: -14 }}>
      <Grid.Column width={3}>
        <Header block inverted as="h3" style={{ height: 48, marginTop: 0 }}>{name}</Header>
        <Header block as="h4" style={{ marginTop: 14 }}>Files:</Header>
        <Card fluid>
          <List style={{ padding: 14 }}>
            {files.map(item => (
              <FileItem key={item.id} item={item} projectId={projectId} />
            ))}
          </List>
        </Card>
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
const mapState = (state, ownProps) => ({
  name: 'Current Project',
  files: Object.entries(state.files).map(entry => entry[1]),
  settings: { tempo: 60, isMetronomeOn: false },
  projectId: +ownProps.match.params.id,
});


export default connect(mapState)(DAW);

