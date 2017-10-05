import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { Waveform } from '../components';
import { updateClipThunk, deleteClip } from '../project-store/reducers/clips';
import { Button } from 'semantic-ui-react';

const styles = {
  clip(clip, zoom) {
    return {
      position: 'absolute',
      left: `${clip.startTime * zoom}px`,
      width: `${clip.duration * zoom}px`,
      height: '140px',
      background: '#22a3ef',
      opacity: '0.8',
      cursor: 'move',
    };
  },
  clipInfo: {
    position: 'absolute',
    top: '0',
    width: '100%',
  },
  clipRemove: {
    position: 'absolute',
    top: '0',
    right: '0',
    margin: '1em',
    padding: '0.5em',
  },
};


class Clip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      x: 0,
      y: 0,
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleMouseEnter() {
    this.setState({ hover: true });
  }

  handleMouseLeave() {
    this.setState({ hover: false });
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
    const { clip, waveform, zoom, project, deleteClip } = this.props;
    const { hover, x, y } = this.state;
    return (
      <Draggable
        bounds=".track-list"
        grid={[1, 154]}
        onDrag={this.handleDrag}
        onStop={this.handleEnd}
        position={{ x, y }}
      >
        <div
          style={styles.clip(clip, zoom)}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <Waveform waveform={waveform} />
          <div style={styles.clipInfo}>
            {clip.url} starting at {clip.startTime}
            { hover && <Button
              style={styles.clipRemove}
              size="mini"
              color="red"
              icon="remove"
              onClick={() => deleteClip(project, clip.key)}
            /> }
          </div>
        </div>

      </Draggable>
    );
  }
}

const mapState = (state, ownProps) => {
  const baseClip = state.clips[ownProps.clip.key];
  const soundClip = state.timeline.soundClips[baseClip.fileId];
  return {
    baseClip,
    waveform: soundClip ? soundClip.waveform : [],
  };
};

const mapDispatch = (dispatch, ownProps) => ({
  updatePosition: (clip, newPosition) => {
    const updatedClip = Object.assign({}, clip, newPosition);
    dispatch(updateClipThunk(ownProps.project, ownProps.clip.key, updatedClip));
  },
  deleteClip: (project, clipKey) => dispatch(deleteClip(project, clipKey))
});

export default connect(mapState, mapDispatch)(Clip);
