import React from 'react';
import { connect } from 'react-redux';
import { Item, Header, Select, Button, Card, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function ProjectList({ projects, handleSelect, usersOptions, addCollaborator }) {
  return (
    <Grid  style={{marginTop: 30}} divided columns={3}>
      {
        !!projects.length &&
          projects.map((project) => {
            return (
              <Grid.Column key={`project-${project.id}`}>
                <Card.Content>
                <Card.Header style={{textAlign: 'center'}}><Link to={`/projects/${project.id}`}>{project.title}</Link></Card.Header>
                <Card.Description style={{textAlign: 'center'}}>
                {
                  project.users.map(user => <div key={`userkey-${user.id}`}>{user.username}</div>)
                }
                <div style={{display: 'inline-block', float: 'right'}}>
                <br/>
                  <Select onChange={handleSelect} placeholder='name' options={usersOptions} />
                  <Button size='small' style={{marginTop: 10}} onClick={() => addCollaborator(project.id)}>Add Collaborator</Button>
                </div>
                </Card.Description>
                </Card.Content>
              </Grid.Column>
            );
          })
        }
    </Grid>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(ProjectList);
