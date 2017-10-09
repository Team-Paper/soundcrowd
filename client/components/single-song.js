import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Image, Header, Label, Icon, Comment, Form, Button } from 'semantic-ui-react';
import { fetchSong, fetchSongComments, postComment } from '../store';

class SingleSong extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.loadData();
  }

  // componentWillReceiveProps(newProps) {
  //   if (!newProps.song) this.props.loadData();
  // }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleCommentSubmit(event) {
    event.preventDefault();

    const comment = {};
    comment.text = this.state.text;
    comment.user = this.props.user;
    comment.userId = this.props.user.id;
    comment.songId = this.props.song.id;

    console.log(comment);

    this.props.postComment(comment)
    this.setState({ text: '' });
  }

  render() {
    const { song, user } = this.props;
    if (!song) return <div />;
    return (
      <Container>
        <Grid columns={2}>
          <Grid.Row>
            {/* This is the column for the album image, title, artists, etc as well as the actual player */}
            <Grid.Column>
              <Image src={song.trackArtUrl || 'http://via.placeholder.com/300x300'} />
              <br />
              <Header>
                {song.title}
              </Header>
              <Header>
                by {song.artist.map(art => art.username).join(', ') || 'unknown'}
              </Header>
              <audio controls>
                <source src={song.url} type="audio/mp3" />
              </audio>
            </Grid.Column>


            <Grid.Column>
              <Header dividing>Notes:</Header>
              <Container text textAlign='justified'>
                {song.notes}
              </Container>
              <Label>
                {/* TODO: THIS IS HARD CODED RIGHT NOW, FIX LATER */}
                <Icon name='heart' /> {40}
              </Label>
              <Label>
                {/* TODO: THIS IS HARD CODED RIGHT NOW, FIX LATER */}
                <Icon name='play' /> {song.playcount}
              </Label>

              <Comment.Group size='large'>
                <Header as='h3' dividing>Comments</Header>
                {user.id ?
                  <Form reply onSubmit={this.handleCommentSubmit}>
                    <Form.TextArea onChange={this.handleChange} />
                    <Button content='Add Comment' icon='edit' primary />
                  </Form>
                  :
                  <p>Log in or sign up to leave comments</p>
                }

                {
                  this.props.comments.map((comment) => {
                    return (
                      <Comment key={comment.id}>
                        <Comment.Avatar src={comment.user.userImage} />
                        <Comment.Author>
                          {comment.user.username}
                        </Comment.Author>
                        <Comment.Content>
                          {comment.text}
                        </Comment.Content>
                      </Comment>
                    );
                  })
                }
              </Comment.Group>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapState = (state, ownProps) => {
  const id = Number(ownProps.match.params.id);
  return {
    song: state.songs.find(song => id === song.id),
    comments: state.comments.filter(comment => id === comment.songId),
    user: state.user,
  };
};

const mapDispatch = (dispatch, ownProps) => {
  const id = Number(ownProps.match.params.id);
  return {
    loadData: () => {
      dispatch(fetchSong(id));
      dispatch(fetchSongComments(id));
    },
    play: () => {
      // TODO: add thunks to the store to dispatch a play event to the api
    },
    postComment: comment => dispatch(postComment(comment)),
  };
};

export default connect(mapState, mapDispatch)(SingleSong);
