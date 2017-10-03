import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { updateClipThunk } from '../project-store/reducers/clips';

const styles = {
  clip(clip, zoom, isDragging) {
    return {
      position: 'absolute',
      left: `${clip.startTime * zoom}px`,
      width: `${clip.duration * zoom}px`,
      height: '140px',
      background: '#22a3ef',
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move',
    };
  },
};


class Clip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };

    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleDrag(e, data) {
    this.setState({ x: data.x, y: data.y });
  }

  handleEnd(e, data) {
    const { clip, zoom, updatePosition, baseClip } = this.props;
    const newPosition = {
      startTime: clip.startTime + (data.lastX / zoom),
      // track: clip.track + +(data.lastY / 154),
    };
    this.setState({ x: 0, y: 0 });
    updatePosition(baseClip, newPosition);
  }

  render() {
    const { isDragging, clip, zoom } = this.props;
    return (
      <Draggable
        bounds=".track-list"
        grid={[1, 154]}
        onDrag={this.handleDrag}
        onStop={this.handleEnd}
        position={this.state}
      >
        <div style={styles.clip(clip, zoom, isDragging)}>
          {clip.url} starting at {clip.startTime}
        </div>
      </Draggable>
    );
  }
}

const mapState = (state, ownProps) => ({
  baseClip: state.clips[ownProps.clip.key],
});

const mapDispatch = (dispatch, ownProps) => ({
  updatePosition: (clip, newPosition) => {
    const updatedClip = Object.assign({}, clip, newPosition);
    dispatch(updateClipThunk(ownProps.project, ownProps.clip.key, updatedClip));
  },
});

export default connect(mapState, mapDispatch)(Clip);
