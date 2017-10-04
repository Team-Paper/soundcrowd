import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { List } from 'semantic-ui-react';
import { updateClipThunk } from '../project-store/reducers/clips';

const styles = {
  listItem: {
    background: '#22a3ef',
    cursor: 'move',
    marginBottom: '1em',
    overflow: 'hidden',
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

    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleDrag(e, data) {
    this.setState({ x: data.x, y: data.y });
  }

  handleEnd(e, data) {
    console.log('x:', data.lastX, 'y:', data.lastY)




    this.setState({ x: 0, y: 0 });
  }


  render() {
    const { item } = this.props;

    return (
      <Draggable
        onDrag={this.handleDrag}
        onStop={this.handleEnd}
        position={this.state}
      >
        <List.Item
          style={styles.listItem}
          key={item.id}
        >
          {item.filename}
        </List.Item>
      </Draggable>

    )
  }
}

export default FileItem;
