import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Item, Grid, Image, Header, Button, Select } from 'semantic-ui-react';
import { fetchUserComments, fetchUserSongs, clearSongs, fetchUserProjects, addCollaborator, fetchAllUsers } from '../store';
import SongView from './song-view';

/**
 * COMPONENT
 */
class UserHome extends React.Component {
  constructor() {
    super()

    this.state = {
      userToAdd: -1,
    };
    this.addCollaborator = this.addCollaborator.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }


  componentDidMount() {
    if (this.props.user) {
      this.props.loadData(this.props.user.id);
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.user && newProps.user) {
      newProps.loadData(newProps.user.id);
    }
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleSelect(event, { value }) {
    const userToAdd = Number(value);
    this.setState({ userToAdd });
  }

  addCollaborator(projectId) {
    // get the userId you want to add from the state
    const userId = this.state.userToAdd;
    if (!!userId ) this.props.addCollaborator(userId, projectId);
    else console.log('you cannot');
  }

  render() {
    const { user, songs, comments, projects } = this.props;

    if (!user || !songs || !projects) return <div />;

    return (
      <Grid>
        <Grid.Row columns={2}>

          <Grid.Column width={4}>
            <Image inline verticalAlign='top' src={user.userImage} size='medium' />
            <Button icon='write' />
          </Grid.Column>

          <Grid.Column width={8}>
            <Header dividing as='h3'>Welcome, {user.email}</Header>
            <Header dividing as='h4'>Bio:</Header><Button icon='write' />
            <Container text>{user.bio}</Container>
          </Grid.Column>

        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <Header dividing>Your Posted Songs:</Header>
            <Item.Group>
              {
                songs.map((song) => {
                  return (
                    <SongView key={song.id} song={song} size='tiny' />
                  );
                })
              }
            </Item.Group>
            <Item.Group>
              {
                projects.map((project) => {
                  return (
                    <div key={project.id}>
                      <Header><Link to={`/projects/${project.id}`}>{project.title}</Link></Header>
                      <Select onChange={this.handleSelect} placeholder='username' options={this.props.usersOptions} />
                      <Button onClick={() => this.addCollaborator(project.id)} positive>Add Collaborator</Button>
                    </div>
                  );
                })
              }
            </Item.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }



}

/**
 * CONTAINER FOR USER'S OWN PAGE
 * Named for convenience later
 * We can make another mapState and mapDispatch for
 *  the public userpage
 */
const mapStateMyPage = (state) => {
  let userSongs = state.songs.slice();
  userSongs = userSongs.filter((song) => {
    // "artist" should be "artists" but Sequelize is pluralizing things weirdly
    const userIds = song.artist.map(user => user.id);
    return userIds.includes(state.user.id);
  });

  let userProjects = state.projects.slice();
  userProjects = userProjects.filter((project) => {
    const userIds = project.users.map(user => user.id);
    return userIds.includes(state.user.id);
  });

  return {
    user: state.user,
    usersOptions: state.users.map(user => ({ key: user.id, value: user.id, text: user.email })),
    songs: userSongs,
    comments: state.comments.filter(comment => comment.userId === state.user.id),
    projects: userProjects,
  };
};

const mapDispatchMyPage = (dispatch) => {
  return {
    loadData: (userId) => {
      dispatch(fetchUserSongs(userId));
      dispatch(fetchUserComments(userId));
      dispatch(fetchUserProjects(userId));
      dispatch(fetchAllUsers());
    },
    clearData: () => {
      dispatch(clearSongs());
    },
    addCollaborator: (userId, projectId) => dispatch(addCollaborator(userId, projectId)),
  };
};


export default connect(mapStateMyPage, mapDispatchMyPage)(UserHome);
