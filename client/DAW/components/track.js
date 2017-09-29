import React from 'react';
// import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

const styles = {
  track: {
    position: 'relative',
    height: '10em',
    margin: '1em 0',
    boxShadow: '0 1px 0 0 rgba(34,36,38,.15)',
  },
  trackControls: {
    position: 'fixed',
    width: '12em',
    height: '10em',
    margin: '0',
  },
  trackTimeline: {
    // minWidth: '100%',
    width: '2000px',
    height: '100%',
    marginLeft: '12em',
    background: '#22a3ef',
  },
};


const Track = (props) => {
  const { index, clips } = props;
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
          <div key={clip.url}>
            {clip.url} starting at {clip.startTime}
          </div>
        )) }
      </div>
    </div>
  );
};

export default Track;
