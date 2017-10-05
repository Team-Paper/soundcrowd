import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Item, Grid, Image, Header, Button, Select } from 'semantic-ui-react';
import { fetchUserSongs, clearSongs, fetchUserProjects, addCollaborator, fetchFriends, fetchUser } from '../store';
import SongView from './song-view';

/**
 * COMPONENT
 */
class UserHome extends React.Component {
  constructor() {
    super();

    this.state = {
      userToAdd: -1,
    };
    this.addCollaborator = this.addCollaborator.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }


  componentDidMount() {
    if (this.props.user || this.props.loadfirst) this.props.loadData(this.props.user);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.user && (newProps.user || newProps.loadfirst)) {
      newProps.loadData(newProps.user);
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
    if (!!userId) this.props.addCollaborator(userId, projectId);
    else console.log('you cannot');
  }

  render() {
    const { user, songs, projects, pageName } = this.props;

    if (!user || !songs || !projects) return <div />;

    return (
      <Grid>
        <Grid.Row columns={2}>

          <Grid.Column width={4}>
            <Image inline verticalAlign='top' src={user.userImage} size='medium' />
            <Button icon='write' />
          </Grid.Column>

          <Grid.Column width={8}>
            <Header dividing as='h3'>{pageName}</Header>
            <Header dividing as='h4'>Bio:</Header><Button icon='write' />
            <Container text>{user.bio}</Container>
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
            { !!projects.length &&
            <Item.Group>
              <Header dividing>Your Projects:</Header>
              {
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
