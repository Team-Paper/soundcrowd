import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Draggable from 'react-draggable';
import { Waveform } from '../components';
import { updateClipThunk, deleteClip } from '../project-store/reducers/clips';

const styles = {
  clipWrapper(start, length) {
    return {
      position: 'absolute',
      left: `${start}px`,
      width: `${length}px`,
      height: '154px',
    };
  },
  clip(length, offset) {
    return {
      width: `${length}px`,
      height: '100%',
      marginLeft: `${-(offset)}px`,
      background: '#22a3ef',
      opacity: '0.8',
      cursor: 'move',
    };
  },
  clipInfo: {
    position: 'absolute',
    top: '0',
    width: '100%',
    height: '100%',
  },
  clipRemove: {
    position: 'absolute',
    top: '0',
    right: '0',
    margin: '1em',
    padding: '0.5em',
  },
  clipHandle(side) {
    return Object.assign({
      position: 'absolute',
      top: '0',
      height: '100%',
      width: '20px',
      background: 'black',
      cursor: 'col-resize',
      opacity: '0.8',
    }, side === 'left' ? { left: '0' } : { right: '0' });
  },
};

class ClipHandle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
    };

    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDrag(e, data) {
    this.props.handle(data.x);
    this.setState({ x: 0 });
  }

  render() {
    const { x } = this.state;
    return (
      <Draggable
        axis="x"
        onStart={e => e.stopPropagation()}
        onDrag={this.handleDrag}
        position={{ x, y: 0 }}
      >
        <div style={styles.clipHandle(this.props.side)} />
      </Draggable>
    );
  }
}

class Clip extends React.Component {
  constructor(props) {
    super(props);
    // const { clip, zoom } = props;
    this.state = {
      hover: false,
      offsetStart: 0,
      offsetEnd: 0,
      x: 0,
      y: 0,
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.dragOffsetStart = this.dragOffsetStart.bind(this);
    this.dragOffsetEnd = this.dragOffsetEnd.bind(this);
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

  dragOffsetStart(pos) {
    this.setState({ offsetStart: pos });
  }

  dragOffsetEnd(pos) {
    this.setState({ offsetEnd: pos });
  }

  render() {
    const { clip, waveform, zoom, project, deleteClip } = this.props;
    const { hover, offsetStart, offsetEnd, x, y } = this.state;
    console.log('offset', clip.duration, ' - ', offsetStart, ' + ', offsetEnd);
    return (
      <Draggable
        bounds=".track-list"
        grid={[1, 154]}
        onDrag={this.handleDrag}
        onStop={this.handleEnd}
        position={{ x, y }}
      >
        <div style={styles.clipWrapper(
          offsetStart + (clip.startTime * zoom),
          ((clip.duration * zoom) - offsetStart) + offsetEnd)}
        >
          <div
            style={styles.clip(clip.baseDuration * zoom, offsetStart)}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <Waveform waveform={waveform} />
            <div style={styles.clipInfo}>
              <ClipHandle side="left" handle={this.dragOffsetStart} />
              {clip.url} starting at {clip.startTime}
              { hover && <Button
                style={styles.clipRemove}
                size="mini"
                color="red"
                icon="remove"
                onClick={() => deleteClip(project, clip.key)}
              /> }
              <ClipHandle side="right" handle={this.dragOffsetEnd} />
            </div>
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
  deleteClip: (project, clipKey) => dispatch(deleteClip(project, clipKey)),
});

export default connect(mapState, mapDispatch)(Clip);
