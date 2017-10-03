import React from 'react';
import { connect } from 'react-redux';

const styles = {
  marker(time, zoom) {
    return {
      position: 'absolute',
      top: '0',
      left: '1px',
      width: '1px',
      height: '100%',
      background: '#e22',
      transform: `translateX(${time * zoom}px)`,
    };
  },
};

const PlaybackMarker = (props) => {
  const { time, zoom } = props;
  return (
    <div style={styles.marker(time, zoom)} />
  );
};

const mapState = state => ({
  time: state.timeline.time,
});

export default connect(mapState)(PlaybackMarker);
