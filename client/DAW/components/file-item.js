/* global window */
import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { List, Icon, Input } from 'semantic-ui-react';
// import { updateClipThunk } from '../project-store/reducers/clips';
import { startDragging, stopDragging } from '../project-store/reducers/dragging';
import { setName } from '../project-store/reducers/files';

const styles = {
  listItem(isDragging) {
    return {
      position: 'relative',
      background: '#22a3ef',
      cursor: 'move',
      margin: '1em 0',
      opacity: isDragging ? '0.8' : '1',
      borderRadius: '4px',
      padding: '0 .6em',
      lineHeight: '3em',
    };
  },
  dragHandle: {
    display: 'inline-block',
    height: '100%',
    borderLeft: 'solid 1px rgba(34, 36, 38, 0.15)',
    paddingLeft: '1em',
  },
  draggingItem(isDragging) {
    if (!isDragging) return {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
      opacity: '0',
    };
    return {
      position: 'absolute',
      height: '140px',
      marginTop: '-70px',
      background: '#22a3ef',
      opacity: '0.5',
      pointerEvents: 'none',
      zIndex: '20',
    };
  },
};


class FileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      dirty: false
    };

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleChange = this.handleChange.bind(this)
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

  handleChange(projectId, file, newName){
    this.setState({dirty: true})
    this.props.setName(projectId, file, newName)
  }

  render() {
    const { isDragging, item, setName, projectId } = this.props;
    const { x, y } = this.state;
    console.log(this.props)
    return (
      <List.Item
        style={styles.listItem(isDragging)}
        key={item.id}
      >
        <Input
          type="text"
          transparent
          style={{ width: '145px' }}
          value={item.name || this.state.dirty ? item.name : item.filename}
          onChange={e => this.handleChange(projectId, item, e.target.value)}
        />
        <span style={styles.dragHandle}><Icon name="move" /></span>
        <Draggable onStart={this.handleStart} position={{ x, y }} >
          <div style={styles.draggingItem(isDragging)}>{item.filename}</div>
        </Draggable>
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
  setName: (projectId, file, newName) => dispatch(setName(projectId, file, newName)),
});

export default connect(mapState, mapDispatch)(FileItem);
