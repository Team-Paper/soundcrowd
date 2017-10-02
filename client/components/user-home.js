import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Item, Grid, Image, Header, Button } from 'semantic-ui-react';
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
                          <Button compact negative icon="delete" />
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
  return {
    user: state.user,
    songs: state.songs.filter(song => song.userId === state.user.id),
    comments: state.comments.filter(comment => comment.userId === state.user.id),
  };
};

const mapDispatchMyPage = (dispatch) => {
  return {
    loadData: (userId) => {
      dispatch(fetchUserSongs(userId));
      dispatch(fetchUserComments(userId));
    },
  };
};


export default connect(mapStateMyPage, mapDispatchMyPage)(UserHome);
