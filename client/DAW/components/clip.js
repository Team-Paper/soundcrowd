import React from 'react';
import Draggable from 'react-draggable';

const styles = {
  clip(clip, zoom, isDragging) {
    return {
      position: 'absolute',
      left: `${clip.startTime * zoom}px`,
      width: `${clip.duration * zoom}px`,
      height: '100%',
      background: '#22a3ef',
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move',
    };
  },
};

const Clip = (props) => {
  const { isDragging, clip, zoom } = props;
  return (
    <Draggable
      axis="x"
      bounds="parent"
    >
      <div style={styles.clip(clip, zoom, isDragging)}>
        {clip.url} starting at {clip.startTime}
      </div>
    </Draggable>
  );
};

export default Clip;
