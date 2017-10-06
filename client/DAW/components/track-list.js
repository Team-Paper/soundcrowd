import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';
import { PlaybackMarker, Track, TrackControls, WaveformGradient } from '../components';

const styles = {
  trackListWrapper: {
    display: 'flex',
    marginTop: '1em',
    overflowY: 'scroll',
  },
  trackControlList: {
    margin: '1px',
  },
  trackList(width) {
    return {
      position: 'relative',
      width: `${width}px`,
      margin: '1px 0',
      boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
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
  const { project, tracks, clips } = props;
  const zoom = 200; // pixels per second
  return (
    <Container style={styles.trackListWrapper}>
      <div style={styles.trackControlList}>
        {
          Object.entries(tracks).map(([key, track]) => (
            <TrackControls key={key} track={track} projectId={project} />
          ))
        }
      </div>
      <div className="track-list" style={styles.trackList(getWidth(clips, zoom))}>
        <WaveformGradient />
        {
          Object.entries(tracks).map(([key, track]) => (
            <Track
              key={`track-${key}`}
              track={track}
              project={project}
              zoom={zoom}
              clips={clips.filter(clip => clip.track === track.id)}
            />
          )) }
        <PlaybackMarker zoom={zoom} />
      </div>
    </Container>
  );
};

const mapState = (state) => {
  const clips = Object.entries(state.clips).map(([key, clip]) => {
    const file = Object.entries(state.files).find(entry => entry[1].id === clip.fileId)[1] || {};
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
