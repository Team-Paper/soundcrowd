import React from 'react';
import { connect } from 'react-redux';
import { Clip } from '../components';
import { addClipThunk } from '../project-store/reducers/clips';

const styles = {
  track: {
    height: '154px',
    boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
  },
  trackTimeline: {
    height: '100%',
  },
};

const Track = (props) => {
  const { clips, draggedFile, dropFile, isDragging, project, zoom } = props;
  return (
    <div
      className="track"
      style={styles.track}
      onMouseUp={() => isDragging && dropFile(draggedFile)}
    >
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
