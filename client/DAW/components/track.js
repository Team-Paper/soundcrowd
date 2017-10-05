import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { Clip, TrackControls } from '../components';
import { addClipThunk } from '../project-store/reducers/clips';

const styles = {
  track: {
    height: '10em',
    marginBottom: '1em',
    boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
  },
  trackControls: {
    position: 'fixed',
    width: '180px',
    height: '10em',
    margin: '0 0 0 -180px',
    zIndex: '10',
  },
  trackTimeline: {
    height: '100%',
  },
};

const Track = (props) => {
  const { clips, draggedFile, dropFile, isDragging, project, track, zoom } = props;
  return (
    <div
      className="track"
      style={styles.track}
      onMouseUp={() => isDragging && dropFile(draggedFile)}
    >
      <Card style={styles.trackControls}>
        <Card.Content>
          <Card.Header>
            Track #{track.id}
          </Card.Header>
          <Card.Description>
            <TrackControls track={track} projectId={project} />
          </Card.Description>
        </Card.Content>
      </Card>
      <div style={styles.trackTimeline}>
        { clips.map(clip => (
          <Clip
            key={clip.key}
            clip={clip}
            project={project}
            zoom={zoom}
          />)) }
      </div>
    </div>
  );
};

const mapState = state => ({
  isDragging: state.dragging.isDragging,
  draggedFile: state.dragging.file,
});

const mapDispatch = (dispatch, ownProps) => ({
  dropFile: file => dispatch(addClipThunk(ownProps.project, file, [ownProps.track.id], 0)),
});


export default connect(mapState, mapDispatch)(Track);
