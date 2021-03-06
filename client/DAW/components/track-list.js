import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { PlaybackMarker, Track, TrackControls, TickMarks, WaveformGradient } from '../components';

const styles = {
  trackListWrapper: {
    display: 'flex',
    position: 'relative',
    marginTop: '1em',
    overflowY: 'scroll',
  },
  trackControlList: {
    height: '100%',
    margin: '31px 0 1px 1px',
  },
  trackList(width, height) {
    return {
      position: 'relative',
      width: `${width + 21}px`,
      height: `${height + 31}px`,
      margin: '1px 0',
    };
  },
  tracksWrapper: {
    position: 'absolute',
    left: '10px',
    right: '10px',
    boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
    overflow: 'hidden',
  },
  trackListView: {
    height: '100%',
    paddingLeft: '1px',
    overflowX: 'scroll',
  },
};

const TrackList = (props) => {
  const { projectId, length, tracks, clips } = props;
  const zoom = 200; // pixels per second
  return (
    <Card fluid style={{ height: '100%' }}>
      <div style={styles.trackListWrapper}>
        <div style={styles.trackControlList}>
          {
            Object.entries(tracks).map(([key, track]) => (
              <TrackControls key={key} track={track} projectId={projectId} />
            ))
          }
        </div>
        <div style={styles.trackListView}>
          <WaveformGradient />
          <div style={styles.trackList(length * zoom, Object.entries(tracks).length * 154)}>
            <TickMarks length={length} zoom={zoom} />
            <div className="track-list" style={styles.tracksWrapper}>
              {
                Object.entries(tracks).map(([key, track]) => (
                  <Track
                    key={`track-${key}`}
                    track={track}
                    projectId={projectId}
                    zoom={zoom}
                    clips={clips.filter(clip => clip.track === track.id)}
                  />
                )) }
            </div>
            <PlaybackMarker zoom={zoom} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const mapState = (state) => {
  const clips = Object.entries(state.clips).map(([key, clip]) => {
    const file = Object.entries(state.files).find(entry => entry[1].id === clip.fileId)[1] || {};
    const baseClip = state.timeline.soundClips[clip.fileId];
    return {
      url: file.url,
      name: file.name,
      key,
      track: clip.track,
      startTime: clip.startTime,
      offset: clip.offset || 0,
      duration: clip.duration,
      baseDuration: baseClip ? baseClip.duration : 0,
    };
  });
  return { clips, length: state.settings.length || 10 };
};

export default connect(mapState)(TrackList);
