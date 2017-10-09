import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Item, Grid, Image, Header, Button, Select, Form, Input } from 'semantic-ui-react';
import axios from 'axios';
import { fetchUserSongs, clearSongs, fetchUserProjects, addCollaborator, fetchFriends, fetchUser, addProject, updateUser } from '../store';
import SongView from './song-view';

/**
 * COMPONENT
 */
class UserHome extends React.Component {
  constructor() {
    super();

    this.state = {
      userToAdd: -1,
      bio: '',
      bioDirty: false,
    };
    this.addCollaborator = this.addCollaborator.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.createProject = this.createProject.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleBioSave = this.handleBioSave.bind(this);
  }


  componentDidMount() {
    if (this.props.user || this.props.loadfirst) this.props.loadData(this.props.user);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.user && (newProps.user || newProps.loadfirst)) {
      newProps.loadData(newProps.user);
    }
    if (!this.state.bio && newProps.user && newProps.user.bio) {
      this.setState({ bio: newProps.user.bio });
    }
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleBioChange(event) {
    this.setState({ bio: event.target.value, bioDirty: true });
  }

  handleBioSave() {
    this.props.saveBio(this.props.user, this.state.bio);
    this.setState({ bioDirty: false });
  }

  handleSelect(event, { value }) {
    const userToAdd = Number(value);
    this.setState({ userToAdd });
  }

  addCollaborator(projectId) {
    // get the userId you want to add from the state
    const userId = this.state.userToAdd;
    if (!!userId) this.props.addCollaborator(userId, projectId);
    else console.log('you cannot');
  }

  createProject(e) {
    const { addProject } = this.props;
    axios.post('/api/projects', { title: e.target.title.value })
      .then(res => res.data)
      .then(project => addProject(project))
      .catch(console.error)
  }

  render() {
    const { user, songs, projects, pageName } = this.props;

    if (!user || !songs || !projects) return <div />;

    return (
      <Grid>
        <Grid.Row columns={2}>

          <Grid.Column width={4}>
            <Image inline verticalAlign='top' src={user.userImage} size='medium' />
          </Grid.Column>

          <Grid.Column width={8}>
            <Header dividing as='h3'>{pageName}</Header>
            <Header dividing as='h4'>Bio:</Header>
            <Input as={this.props.isSelf ? Input : Container} fluid onChange={this.handleBioChange} transparent={!this.props.isSelf} value={this.state.bio} />
            {
              this.props.isSelf &&
              <Button onClick={this.handleBioSave} disabled={!this.state.bioDirty}>Save Changes</Button>
            }
          </Grid.Column>

        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <Header dividing>Posted Songs:</Header>
            <Item.Group>
              {
                songs.map((song) => {
                  return (
                    <SongView key={song.id} song={song} size='tiny' />
                  );
                })
              }
            </Item.Group>

            {this.props.isSelf &&

              <Item.Group>
                <Header dividing>Your Projects:</Header>
                <Form onSubmit={this.createProject}>
                  <Form.Field>
                    <label>Project Title</label>
                    <input placeholder='Title' name='title' />
                  </Form.Field>
                  <Button type='submit'>Create Project</Button>
                </Form>
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
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

/**
 * CONTAINER FOR USER'S OWN PAGE
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
    pageName: `Hello, ${state.user.username}`,
    user: state.user,
    usersOptions: state.users.map(user => ({ key: user.id, value: user.id, text: user.username || user.name })),
    songs: userSongs,
    comments: state.comments.filter(comment => comment.userId === state.user.id),
    projects: userProjects,
    isSelf: true,
  };
};

const mapDispatchMyPage = (dispatch) => {
  return {
    loadData: (user) => {
      dispatch(fetchUser(user.id));
      dispatch(fetchUserSongs(user.id));
      dispatch(fetchUserProjects(user.id));
      dispatch(fetchFriends());
    },
    clearData: () => {
      dispatch(clearSongs());
    },
    addCollaborator: (fbId, projectId) => dispatch(addCollaborator(fbId, projectId)),
    addProject: project => dispatch(addProject(project)),
    saveBio: (user, bio) => dispatch(updateUser({ ...user, bio })),
  };
};


/**
 * CONTAINER FOR PUBLIC USER PAGE
 */
const mapStatePublicPage = (state, ownProps) => {
  const userId = Number(ownProps.match.params.id);
  let userSongs = state.songs.slice();
  userSongs = userSongs.filter((song) => {
    // "artist" should be "artists" but Sequelize is pluralizing things weirdly
    const userIds = song.artist.map(user => user.id);
    return userIds.includes(userId);
  });

  const user = state.users.find(user => user.id === userId);
  const username = user ? user.username : ''; // if no user on state yet, username will temporarily be ''

  return {
    user,
    loadfirst: true,
    pageName: username,
    songs: userSongs,
    projects: [],
    isSelf: false,
  };
};

const mapDispatchPublicPage = (dispatch, ownProps) => {
  const userId = Number(ownProps.match.params.id);

  return {
    loadData: () => {
      dispatch(fetchUserSongs(userId));
      dispatch(fetchUser(userId));
    },
    clearData: () => {
      dispatch(clearSongs());
    },
  };
};


const UserHomeConnected = connect(mapStateMyPage, mapDispatchMyPage)(UserHome);
const PublicPage = connect(mapStatePublicPage, mapDispatchPublicPage)(UserHome);

export { UserHomeConnected, PublicPage };
