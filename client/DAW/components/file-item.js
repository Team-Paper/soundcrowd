import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { List, Icon } from 'semantic-ui-react';
import { updateClipThunk } from '../project-store/reducers/clips';

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
    background: '#22a3ef',
    opacity: '0.5',
    zIndex: '20',
  },
};


class FileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      x: 0,
      y: 0,
    };

    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleDrag(e, data) {
    this.setState({ isDragging: true, x: data.x, y: data.y });
  }

  handleEnd(e, data) {
    console.log('x:', data.lastX, 'y:', data.lastY)




    this.setState({ isDragging: false, x: 0, y: 0 });
  }


  render() {
    const { item } = this.props;
    const { isDragging, x, y } = this.state;

    return (
      <List.Item
        style={styles.listItem(isDragging)}
        key={item.id}
      >
        <Draggable
          onDrag={this.handleDrag}
          onStop={this.handleEnd}
          position={{ x, y }}
        >
          {isDragging ? <div style={styles.draggingItem}>{item.filename}</div> : <Icon name="move" />}
        </Draggable>
        {item.filename}
      </List.Item>
    )
  }
}

export default FileItem;
