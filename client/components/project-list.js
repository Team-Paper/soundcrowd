import React from 'react';
import { connect } from 'react-redux';
import { Item, Header, Select, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function ProjectList({ projects, handleSelect, usersOptions, addCollaborator }) {
  return (
    <Item.Group>
      {
        !!projects.length &&
          projects.map((project) => {
            return (
              <div key={project.id}>
                <Header><Link to={`/projects/${project.id}`}>{project.title}</Link></Header>
                <Select onChange={handleSelect} placeholder='name' options={usersOptions} />
                <Button onClick={() => addCollaborator(project.id)} positive>Add Collaborator</Button>
              </div>
            );
          })
        }
    </Item.Group>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(ProjectList);
