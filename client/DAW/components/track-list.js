import React from 'react';
// import { connect } from 'react-redux';
import { Track } from '../components';

const styles = {
  trackList: {
    position: 'relative',
    marginTop: '4em',
    boxShadow: '0 -1px 0 0 rgba(34,36,38,.15)',
  },
};


const TrackList = (props) => {
  const { tracks, clips } = props;
  return (
    <div style={styles.trackList}>
      { tracks.map((track, index) => (
        <Track
          key={track.id}
          index={index}
          clips={clips.filter(clip => clip.track === track.id)}
        />
      )) }
    </div>
  );
};

export default TrackList;
