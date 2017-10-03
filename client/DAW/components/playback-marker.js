import React from 'react';

const styles = {
  marker: {
    position: 'absolute',
    top: '0',
    left: '1px',
    width: '1px',
    height: '100%',
    background: '#e22',
  },
};

const PlaybackMarker = () => (
  <div style={styles.marker} />
);

export default PlaybackMarker;
