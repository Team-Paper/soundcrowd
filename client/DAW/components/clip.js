import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { updateClipThunk } from '../project-store/reducers/clips';

const styles = {
  clip(clip, zoom, isDragging) {
    return {
      position: 'absolute',
      left: `${clip.startTime * zoom}px`,
      width: `${clip.duration * zoom}px`,
      height: '140px',
      background: '#22a3ef',
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move',
    };
  },
};


const Clip = (props) => {
  const { isDragging, baseClip, clip, zoom, updatePosition } = props;
  return (
    <Draggable
      bounds=".track-list"
      grid={[1, 154]}
      onStop={updatePosition(baseClip, zoom)}
    >
      <div style={styles.clip(clip, zoom, isDragging)}>
        {clip.url} starting at {clip.startTime}
      </div>
    </Draggable>
  );
};

const mapState = (state, ownProps) => ({
  baseClip: state.clips[ownProps.clip.key],
});

const mapDispatch = (dispatch, ownProps) => ({
  updatePosition: (clip, zoom) => (e, data) => {
    // should also change track number >>> data.lastY / 154
    const newPosition = { startTime: clip.startTime + (data.lastX / zoom) };
    const updatedClip = Object.assign({}, clip, newPosition);
    dispatch(updateClipThunk(ownProps.project, ownProps.clip.key, updatedClip));
  },
});

export default connect(mapState, mapDispatch)(Clip);
