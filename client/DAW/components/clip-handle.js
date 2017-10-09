import React from 'react';
import Draggable from 'react-draggable';

const styles = {
  clipHandle(side, offset, hover) {
    return {
      position: 'absolute',
      top: '0',
      [side]: offset,
      height: '100%',
      width: '20px',
      background: `linear-gradient(to ${side}, rgba(0,0,0,0), rgba(0,0,0,.5))`,
      cursor: 'ew-resize',
      opacity: hover ? '0.8' : '0',
      transition: 'opacity 0.2s',
    };
  },
};

class ClipHandle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      x: 0,
    };

    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDrag(e, data) {
    const { offset, side } = this.props;
    const diff = side === 'left' ? data.x : -(data.x);
    if (offset + diff > 0) {
      this.props.handleDrag(diff);
    } else {
      this.props.handleDrag(-(offset));
    }
    this.setState({ x: 0 });
  }

  render() {
    const { offset, side } = this.props;
    const { hover, x } = this.state;
    return (
      <Draggable
        axis="x"
        bounds="parent"
        onStart={e => e.stopPropagation()}
        onDrag={this.handleDrag}
        onStop={this.props.handleEnd}
        position={{ x, y: 0 }}
      >
        <div
          style={styles.clipHandle(side, offset, hover)}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        />
      </Draggable>
    );
  }
}

export default ClipHandle;
