import React from 'react';
import { connect } from 'react-redux';
import { Item, Form, Button } from 'semantic-ui-react';

function ProjectAdd({ createProject }) {
  return (
    <Form onSubmit={createProject}>
      <Form.Field>
        <label>Project Title</label>
        <input placeholder='Title' name='title' />
      </Form.Field>
      <Button type='submit'>Create Project</Button>
    </Form>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(ProjectAdd);
