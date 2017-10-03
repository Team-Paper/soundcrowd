import React from 'react';
// import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { Clip } from '../components';

const styles = {
  track: {
    height: '10em',
    marginBottom: '1em',
    boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
  },
  trackControls: {
    position: 'fixed',
    width: '180px',
    height: '10em',
    margin: '0 0 0 -180px',
    zIndex: '10',
  },
  trackTimeline: {
    height: '100%',
  },
};

const Track = (props) => {
  const { index, clips, project, zoom } = props;
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

export default Track;
