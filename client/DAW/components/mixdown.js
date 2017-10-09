import React from 'react';
import { Button, Input, Menu, Modal } from 'semantic-ui-react';

class MixdownModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mixTitle: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ mixTitle: e.target.value });
  }

  render() {
    const { mixdown } = this.props;
    return (
      <Modal size="tiny" trigger={<Menu.Item>mixdown</Menu.Item>}>
        <Modal.Header>Mixdown project</Modal.Header>
        <Modal.Content>
          <Input
            value={this.state.mixTitle}
            placeholder="project name"
            onChange={this.handleChange}
          />
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="mixdown"
            onClick={() => mixdown(this.state.mixTitle)}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default MixdownModal;
