import React from 'react';
import Draggable from 'react-draggable';

const styles = {
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

export default ClipHandle;
