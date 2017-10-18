import React from 'react';
import { Form, Button } from 'semantic-ui-react';

function ProjectAdd({ createProject }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Form style={{ paddingTop: 30, paddingBottom: 30 }} onSubmit={createProject}>
        <Form.Field>
          <label htmlFor="newProjectTitle">Project Title</label>
          <input id="newProjectTitle" placeholder="Title" name="title" />
        </Form.Field>
        <Button type="submit">Create Project</Button>
      </Form>
    </div>
  );
}

export default ProjectAdd;
