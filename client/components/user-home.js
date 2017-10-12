import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Item, Grid, Image, Header, Button, Select, Form, Tab, Card, Feed } from 'semantic-ui-react';
import axios from 'axios';
import { fetchUserSongs, clearSongs, fetchUserProjects, addCollaborator, fetchFriends, fetchUser, addProject } from '../store';
import SongList from './song-list';
import ProjectList from './project-list';
import ProjectAdd from './project-add';
import CollaboratorList from './collaborator-list';
import CommentList from './comment-list';
import { WaveformGradient } from '../DAW/components';

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
    console.log('userToAdd is', userToAdd)
    this.setState({ userToAdd });
  }

  addCollaborator(projectId) {
    // get the userId you want to add from the state
    const userId = this.state.userToAdd;
    if (userId) this.props.addCollaborator(userId, projectId);
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
    const { user, songs, projects, pageName, isSelf, usersOptions } = this.props;
    console.log('props are', this.props)
    if (!user || !songs || !projects) return <div />;
    console.log('usersOptions is', usersOptions);
    const panes = [
      { menuItem: 'Songs', render: () => <Tab.Pane attached={false}><SongList songs={songs} /></Tab.Pane> },
    ];

    if (isSelf) {
      panes.push({ menuItem: 'Projects', render: () =>
        <Tab.Pane attached={false}>
          <Grid divided='vertically'>
            <Grid.Row>
              <Grid.Column width={16}>
                <Header block as='h3'>Create Project</Header>
                <ProjectAdd createProject={this.createProject} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Header block as='h3'>Existing Projects</Header>
                <ProjectList
                  projects={projects}
                  handleSelect={this.handleSelect}
                  usersOptions={usersOptions}
                  addCollaborator={this.addCollaborator}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane> })
    }

    const styles = {
      header: { backgroundColor: '#222222' },
      title: { color: '#ffffff', paddingBottom: 10, paddingTop: 10 },
      headerImage: { paddingBottom: 10 },
    }

    return (
      <Grid>
        <Grid.Row style={ styles.header }>
          <Grid.Column width={16} >
            <Header size='huge' textAlign='center' style={styles.title}>{user.username}</Header>
            <Image src={user.userImage} style={styles.headerImage} size='small' shape='circular' centered />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={10} >
            <WaveformGradient />
            <Tab menu={{ attached: false }} panes={panes} />
          </Grid.Column>
          <Grid.Column width={4} >
            <Header block >About</Header>
            <Card fluid>
              <Card.Content>
                <em>{user.bio}</em>
              </Card.Content>
            </Card>
            <Header block inverted>Recent Collaborators</Header>
            <CollaboratorList userId={user.id} />
            <Header block inverted>Latest Comments</Header>
            <CommentList userId={user.id} />
          </Grid.Column>
          <Grid.Column width={1} />
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
    users: state.users,
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
