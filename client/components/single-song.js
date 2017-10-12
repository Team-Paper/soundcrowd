import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Header, Icon, Comment, Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import { fetchSong, fetchSongComments, postComment } from '../store';
import context from '../DAW/context';
import { createWaveform } from '../DAW/waveformBuilder';
import { Waveform, WaveformGradient } from '../DAW/components';

class SingleSong extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
      waveform: [],
    };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.loadData()
      .then(action => action.song)
      .then(song => axios.get(song.url, { responseType: 'arraybuffer' }))
      .then(res => res.data)
      .then(responseAudio => context.decodeAudioData(responseAudio))
      .then(audio => this.setState({ waveform: createWaveform(audio, audio.length / 1000) }))
      .catch(console.error);
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
    const styles = {
      header: { backgroundColor: '#222222' },
      title: { color: '#ffffff', paddingBottom: 10, paddingTop: 10 },
      controls: { width: '100%', marginBottom: '1em' },
      waveform: { height: '154px', background: '#22a3ef' },
      comments: { maxWidth: '100%' },
    };
    const { song, user } = this.props;
    if (!song) return <div />;
    return (
      <Grid centered>
        <Grid.Row style={styles.header} >
          <Grid.Column width={14} >
            <Header size='huge' textAlign='center' style={styles.title}>
              {song.title}
            </Header>
            <div style={styles.waveform}>
              <WaveformGradient />
              <Waveform waveform={this.state.waveform} />
            </div>
            <audio controls style={styles.controls}>
              <source src={song.url} type="audio/mp3" />
            </audio>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ padding: '2em 0' }}>
          <Grid.Column width={7}>
            <Header>
              by {song.artist.map(art => art.username).join(', ') || 'unknown'}
            </Header>
            <Button
              as="a"
              color="facebook"
              className="fb-share-button fb-xfbml-parse-ignore"
              data-href={`https://thesoundcrowd.herokuapp.com/song/${song.id}`}
              data-layout="button"
              data-size="small"
              data-mobile-iframe="true"
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=https://thesoundcrowd.herokuapp.com/song/${song.id}`}
            >
              <Icon name="facebook" />
              Share
            </Button>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header dividing>Notes:</Header>
            <Container fluid text textAlign='justified'>
              {song.notes}
            </Container>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={14}>
            <Comment.Group style={styles.comments} size='large'>
              <Header as='h3' dividing>Comments</Header>
              {user.id ?
                <Form reply style={{ paddingBottom: '2em' }} onSubmit={this.handleCommentSubmit}>
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
                      <Comment.Content>
                        <Comment.Author>
                          {comment.user.username}
                        </Comment.Author>
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
      dispatch(fetchSongComments(id));
      return dispatch(fetchSong(id));
    },
    play: () => {
      // TODO: add thunks to the store to dispatch a play event to the api
    },
    postComment: comment => dispatch(postComment(comment)),
  };
};

export default connect(mapState, mapDispatch)(SingleSong);
