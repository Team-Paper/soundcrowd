import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { fetchCollaborators } from '../store';
import CollaboratorEntry from './collaborator-entry';

class CollaboratorList extends React.Component {
  componentDidMount() {
    const { fetchCollaborators, userId } = this.props;
    fetchCollaborators(userId);
  }

  render() {
    const { collaborators } = this.props;
    console.log('list collaborators are', collaborators);
    return (
      <Card fluid>
        <Card.Content>
          {
            collaborators.map(collaborator => <CollaboratorEntry key={`collaborator-${collaborator.id}`} collaborator={collaborator} />)
          }
        </Card.Content>
      </Card>
    );
  }
}

const mapState = (state, ownProps) => ({
  collaborators: state.collaborators,
});

const mapDispatch = dispatch => ({
  fetchCollaborators: userId => dispatch(fetchCollaborators(userId))
});

export default connect(mapState, mapDispatch)(CollaboratorList);
