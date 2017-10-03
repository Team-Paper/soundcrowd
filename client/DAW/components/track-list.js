import React from 'react';
import { connect } from 'react-redux';
import { Track } from '../components';

const styles = {
  trackList(width) {
    return {
      position: 'relative',
      width: `${width}px`,
      margin: '4em 0 0 180px',
      boxShadow: '0 -1px 0 0 rgba(34,36,38,.15)',
    };
  },
};

const getWidth = (clips, zoom) => {
  let end = 10; // seconds (min-duration)
  clips.forEach((clip) => {
    end = Math.max(end, clip.startTime + clip.duration);
  });
  return (zoom * end);
};

const TrackList = (props) => {
  const { tracks, clips } = props;
  const zoom = 200; // pixels per second
  return (
    <div className="track-list" style={styles.trackList(getWidth(clips, zoom))}>
      {
        Object.entries(tracks).map(([key, track], index) => (
          <Track
            key={`track-${key}`}
            index={index}
            zoom={zoom}
            clips={clips.filter(clip => clip.track === track.id)}
          />
        )) }
    </div>
  );
};

const mapState = (state) => {
  const clips = Object.entries(state.clips).map(([key, clip]) => {
    const file = Object.entries(state.files).find(([fk, f]) => f.id === clip.fileId)[1] || {};
    return {
      url: file.url,
      key,
      track: clip.track,
      startTime: clip.startTime,
      duration: state.timeline.soundClips[clip.fileId] ?
        state.timeline.soundClips[clip.fileId].duration : 0,
    };
  });
  return { clips };
};

export default connect(mapState)(TrackList);
