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
        <Draggable
          onStart={this.handleStart}
          position={{ x, y }}
        >
          { isDragging ?
            <div style={styles.draggingItem}>{item.filename}</div> :
            <Icon name="move" /> }
        </Draggable>
        <Input type="text" transparent value={item.name || this.state.dirty ? item.name : item.filename} onChange={e => this.handleChange(projectId, item, e.target.value)} />
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
