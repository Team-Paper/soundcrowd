import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Item, Grid, Image, Header, Label, Icon, Form, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchUserComments, fetchUserSongs } from '../store';

/**
 * COMPONENT
 */
class UserHome extends React.Component {
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

  render() {
    const { user, songs, comments } = this.props;

    if (!user || !songs) return <div />;

    return (
      <div>
        <h3>Welcome, {user.email}</h3>


        <Grid>
          <Grid.Row columns={2}>

            <Grid.Column width={4}>
              <Image inline verticalAlign='top' src={user.userImage} size='medium' />
              <Button className='float-on-top'><Icon name='write' /></Button>
            </Grid.Column>

            <Grid.Column width={8}>
              <Label>Bio:</Label>
              <div>{user.bio}</div>
            </Grid.Column>

          </Grid.Row>

          <Grid.Row columns={1}>
            <Grid.Column>
              <Header>Your Songs:</Header>
              <Item.Group>
                {
                  songs.map((song) => {
                    return (
                      <Item key={song.id} meta={null}>
                        <Item.Image src={song.imageUrl || 'http://via.placeholder.com/150x150'} size='tiny' />
                        <Item.Content>
                          <Item.Header>
                            <Header as='h4'><Link to={`/song/${song.id}`}>{song.title}</Link></Header>
                          </Item.Header>
                          <Item.Description>
                            <audio controls>
                              <source src={song.url} type="audio/mp3" />
                            </audio>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    );
                  })
                }
              </Item.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.user,
    songs: state.songs.filter(song => song.userId === state.user.id),
    comments: state.comments.filter(comment => comment.userId === state.user.id),
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadData: (userId) => {
      dispatch(fetchUserSongs(userId));
      dispatch(fetchUserComments(userId));
    },
  };
};

export default connect(mapState, mapDispatch)(UserHome);
