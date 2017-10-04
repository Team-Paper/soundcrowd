import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { updateClipThunk, deleteClip } from '../project-store/reducers/clips';
import { Button } from 'semantic-ui-react';


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
      // WARNING: Super not forward compatable. Literally iterates track number.
      track: clip.track + (data.lastY / 154),
    };
    this.setState({ x: 0, y: 0 });
    updatePosition(baseClip, newPosition);
    // NOTE: component tries to call setState after switching tracks
  }

  render() {
    const { isDragging, clip, zoom, project, deleteClip } = this.props;
    return (
      <div>
      <Draggable
        bounds=".track-list"
        grid={[1, 154]}
        onDrag={this.handleDrag}
        onStop={this.handleEnd}
        position={this.state}
      >
        <div style={styles.clip(clip, zoom, isDragging)}>
          {clip.url} starting at {clip.startTime}
          <Button color='red' onClick={() => deleteClip(project, clip.key)}>X</Button>
        </div>

      </Draggable>
      </div>
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
  deleteClip: (project, clipKey) => dispatch(deleteClip(project, clipKey))
});

export default connect(mapState, mapDispatch)(Clip);
