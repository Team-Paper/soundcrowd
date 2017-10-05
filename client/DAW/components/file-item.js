import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { List, Icon } from 'semantic-ui-react';
// import { updateClipThunk } from '../project-store/reducers/clips';
import { startDragging, stopDragging } from '../project-store/reducers/dragging';

const styles = {
  listItem(isDragging) {
    return {
      background: isDragging ? '#59eabf' : '#22a3ef',
      cursor: 'move',
      marginBottom: '1em',
      overflow: 'hidden',
    };
  },
  draggingItem: {
    position: 'absolute',
    height: '140px',
    marginTop: '-70px',
    background: '#22a3ef',
    opacity: '0.5',
    zIndex: '20',
  },
};


class FileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleStart(e, data) {
    this.props.startDrag();
  }

  handleEnd(e, data) {
    this.props.stopDrag();
    this.setState({ x: 0, y: 0 });
  }


  render() {
    const { isDragging, item } = this.props;
    const { x, y } = this.state;

    return (
      <List.Item
        style={styles.listItem(isDragging)}
        key={item.id}
      >
        <Draggable
          onStart={this.handleStart}
          onStop={this.handleEnd}
          position={{ x, y }}
        >
          { isDragging ?
            <div style={styles.draggingItem}>{item.filename}</div> :
            <Icon name="move" /> }
        </Draggable>
        {item.filename}
      </List.Item>
    );
  }
}

const mapState = state => ({
  isDragging: state.dragging.isDragging,
});

const mapDispatch = dispatch => ({
  startDrag: () => dispatch(startDragging()),
  stopDrag: () => dispatch(stopDragging()),
});

export default connect(mapState, mapDispatch)(FileItem);
