import React from 'react';
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react';

function ProjectList({ projects }) {
  return (
    <Item.Group>
      {
        !!projects.length &&
          projects.map((project) => {
            return (
              <div key={project.id}>
                <Header><Link to={`/projects/${project.id}`}>{project.title}</Link></Header>
                <Select onChange={this.handleSelect} placeholder='name' options={this.props.usersOptions} />
                <Button onClick={() => this.addCollaborator(project.id)} positive>Add Collaborator</Button>
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
