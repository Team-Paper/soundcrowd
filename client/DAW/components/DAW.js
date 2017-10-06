import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, List, Button } from 'semantic-ui-react';
import axios from 'axios';
import { Timeline, FileItem } from '../components';
import { addFileThunk } from '../project-store/reducers/files';


/**
 * COMPONENT
 */
export const DAW = (props) => {
  const { name, files, settings, projectId, addFileThunk } = props;

  function onUpload(e) {
    e.preventDefault();
    console.log('e is', e.target.upload.files[0]);

    const formData = new FormData();
    formData.set('blob', e.target.upload.files[0]);
    axios({
      method: 'post',
      url: '/api/soundfiles',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
    })
      .then(res => res.data)
      .then(file => addFileThunk(projectId, file))
      .then(json => console.log('file uploaded', json))
      .catch(console.error)
  }

  return (
    <Grid divided padded>
      <Grid.Column width={3}>
        <Header as="h3">{name}</Header>
        <p>Tempo: {settings.tempo}</p>
        <form onSubmit={onUpload} >
          <input type="file" name="upload" />
          <input type="submit" value="submit" />
        </form>
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
const mapState = (state, ownProps) => ({
  name: 'Current Project',
  files: Object.entries(state.files).map(entry => entry[1]),
  settings: { tempo: 60, isMetronomeOn: false },
  projectId: ownProps.match.params.id,
});

const mapDispatch = dispatch => ({
  addFileThunk: (projectId, file) => dispatch(addFileThunk(projectId, file)),
})

export default connect(mapState, mapDispatch)(DAW);

