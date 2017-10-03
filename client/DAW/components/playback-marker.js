import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';

const styles = {
  marker: {
    position: 'absolute',
    top: '0',
    left: '1px',
    width: '20px',
    height: '100%',
    background: '#e22',
  },
};

class PlaybackMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };

    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ x: newProps.time * newProps.zoom });
  }

  handleDrag(e, data) {
    this.setState({ x: data.x });
  }

  handleEnd(e, data) {
    // this.setState({ x: 0 });
    console.log(data.lastX);
  }

  render() {
    return (
      <Draggable
        axis="x"
        bounds=".track-list"
        onDrag={this.handleDrag}
        onStop={this.handleEnd}
        position={this.state}
      >
        <div style={styles.marker} />
      </Draggable>
    );
  }
}

const mapState = state => ({
  time: state.timeline.time,
});

export default connect(mapState)(PlaybackMarker);
