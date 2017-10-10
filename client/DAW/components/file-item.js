/* global window */
import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { List, Icon } from 'semantic-ui-react';
// import { updateClipThunk } from '../project-store/reducers/clips';
import { startDragging, stopDragging } from '../project-store/reducers/dragging';

const styles = {
  listItem(isDragging) {
    return {
      background: '#22a3ef',
      cursor: 'move',
      marginBottom: '1em',
      opacity: isDragging ? '0.8' : '1',
      overflow: 'hidden',
      borderRadius: 4,
      padding: 4,
    };
  },
  draggingItem: {
    position: 'absolute',
    height: '140px',
    marginTop: '-70px',
    background: '#22a3ef',
    opacity: '0.5',
    pointerEvents: 'none',
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

  handleStart() {
    this.props.startDrag();
    window.addEventListener('mouseup', this.handleEnd);
  }

  handleEnd() {
    window.removeEventListener('mouseup', this.handleEnd);
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

const mapState = (state, ownProps) => ({
  isDragging: state.dragging.file === ownProps.item.id,
});

const mapDispatch = (dispatch, ownProps) => ({
  startDrag: () => dispatch(startDragging(ownProps.item.id)),
  stopDrag: () => dispatch(stopDragging()),
});

export default connect(mapState, mapDispatch)(FileItem);
