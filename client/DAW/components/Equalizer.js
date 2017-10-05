import React from 'react';
import { connect } from 'react-redux';
import { Button, Header, Image, Modal, Checkbox, Select } from 'semantic-ui-react';

function EqualizerModal({ projectId, track }) {
  return (
    <Modal trigger={<Button>EQ</Button>}>
    <Modal.Header>12-Band Equalizer (Track {track.id})</Modal.Header>
    <Modal.Content>
      <Modal.Description>

      </Modal.Description>
    </Modal.Content>
  </Modal>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(EqualizerModal);
