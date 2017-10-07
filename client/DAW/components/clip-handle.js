import React from 'react';
import Draggable from 'react-draggable';

const styles = {
  clipHandle(side, offset) {
    return {
      position: 'absolute',
      top: '0',
      [side]: offset,
      height: '100%',
      width: '20px',
      background: 'black',
      cursor: 'col-resize',
      opacity: '0.8',
    };
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
    if (this.props.offset + data.x > 0) {
      this.props.handleDrag(data.x);
    } else {
      this.props.handleDrag(-(this.props.offset));
    }
    this.setState({ x: 0 });
  }

  render() {
    const { offset, side } = this.props;
    const { x } = this.state;
    return (
      <Draggable
        axis="x"
        bounds="parent"
        onStart={e => e.stopPropagation()}
        onDrag={this.handleDrag}
        onStop={this.props.handleEnd}
        position={{ x, y: 0 }}
      >
        <div style={styles.clipHandle(side, offset)} />
      </Draggable>
    );
  }
}

export default ClipHandle;
