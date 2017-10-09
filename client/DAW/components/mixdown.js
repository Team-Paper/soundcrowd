import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Menu, Modal, Progress } from 'semantic-ui-react';

class MixdownModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mixTitle: '',
      progress: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMixdown = this.handleMixdown.bind(this);
    this.progressTimer = this.progressTimer.bind(this);
  }

  handleChange(e) {
    this.setState({ mixTitle: e.target.value });
  }

  handleMixdown() {
    const { mixTitle } = this.state;
    const { mixdown } = this.props;
    mixdown(mixTitle, song => console.log('song finished!', song));
    this.progressTimer(Date.now());
  }

  progressTimer(start) {
    const { length } = this.props;
    const diff = (Date.now() - start) / (length * 1000);
    if (diff > 1) {
      this.setState({ progress: 100 });
    } else {
      this.setState({ progress: parseInt(diff * 100, 10) });
      setTimeout(() => this.progressTimer(start), 10);
    }
  }

  render() {
    const { mixTitle, progress } = this.state;
    return (
      <Modal size="tiny" trigger={<Menu.Item>mixdown</Menu.Item>}>
        <Modal.Header>Mixdown project</Modal.Header>
        <Modal.Content>
          <Input
            value={mixTitle}
            placeholder="project name"
            onChange={this.handleChange}
          />
          <Button
            positive
            disabled={mixTitle === ''}
            icon="checkmark"
            labelPosition="right"
            content="mixdown"
            onClick={this.handleMixdown}
          />
          <Progress color="green" percent={progress} />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapState = state => ({
  length: state.settings.length,
});

export default connect(mapState)(MixdownModal);
