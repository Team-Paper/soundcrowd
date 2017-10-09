import React from 'react';
import { Button, Menu, Modal } from 'semantic-ui-react';

const MixdownModal = (props) => {
  const { mixdown } = props;
  return (
    <Modal size="tiny" trigger={<Menu.Item>mixdown</Menu.Item>}>
      <Modal.Header>Mixdown project</Modal.Header>
      <Modal.Content>
        <p>project name</p>
        <Button positive icon="checkmark" labelPosition="right" content="mixdown" />
      </Modal.Content>
    </Modal>
  );
};

export default MixdownModal;
