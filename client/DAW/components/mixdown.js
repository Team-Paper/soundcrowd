import React from 'react';
import { Button, Input, Menu, Modal } from 'semantic-ui-react';

class MixdownModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mixTitle: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMixdown = this.handleMixdown.bind(this);
  }

  handleChange(e) {
    this.setState({ mixTitle: e.target.value });
  }

  handleMixdown() {
    const { mixTitle } = this.state;
    const { mixdown } = this.props;
    mixdown(mixTitle, song => console.log('song finished!', song));
  }

  render() {
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
            onClick={this.handleMixdown}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default MixdownModal;
