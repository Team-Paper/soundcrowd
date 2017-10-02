import React from 'react';
// import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

const styles = {
  track: {
    position: 'relative',
    height: '10em',
    marginBottom: '1em',
    boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
  },
  trackControls: {
    position: 'fixed',
    width: '180px',
    height: '10em',
    margin: '0',
    zIndex: '10',
  },
  trackTimeline: {
    position: 'relative',
    height: '100%',
    marginLeft: '180px',
  },
  clip(clip, zoom) {
    return {
      position: 'absolute',
      left: `${clip.startTime * zoom}px`,
      width: `${clip.duration * zoom}px`,
      height: '100%',
      background: '#22a3ef',
    };
  },
};

const Track = (props) => {
  const { index, clips, zoom } = props;
  return (
    <div className="track" style={styles.track}>
      <Card style={styles.trackControls}>
        <Card.Content>
          <Card.Header>
            Track #{index + 1}
          </Card.Header>
          <Card.Description>
            Track specific controls go here
          </Card.Description>
        </Card.Content>
      </Card>
      <div style={styles.trackTimeline}>
        {
          clips.map(clip => (
          <div key={clip.key} style={styles.clip(clip, zoom)}>
            {clip.url} starting at {clip.startTime}
          </div>
        )) }
      </div>
    </div>
  );
};

export default Track;
