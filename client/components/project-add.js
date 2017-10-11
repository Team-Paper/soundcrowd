import React from 'react';
import { connect } from 'react-redux';
import { Item, Form, Button, Header } from 'semantic-ui-react';

function ProjectAdd({ createProject }) {
  return (
    <div style={{textAlign: 'center'}}>
      <Form style={{paddingTop: 30, paddingBottom: 30}} onSubmit={createProject}>
        <Form.Field>
          <label>Project Title</label>
          <input placeholder='Title' name='title' />
        </Form.Field>
        <Button type='submit'>Create Project</Button>
      </Form>
    </div>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(ProjectAdd);
