import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchTopSongs, clearSongs } from '../store';
import SongList from './song-list';
import CommentList from './comment-list';
import { WaveformGradient } from '../DAW/components';

/**
 * COMPONENT
 */
class LandingPage extends React.Component {
  componentDidMount() {
    if (this.props.fetchData) this.props.fetchData();
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const styles = {
      header: { backgroundColor: '#222222' },
      title: { color: '#ffffff', paddingBottom: 10, paddingTop: 10 },
    }
    const { songs } = this.props
    return (
      <Grid>
        <Grid.Row style={styles.header} >
          <Grid.Column width={16} >
            <Header size='huge' textAlign='center' style={styles.title}>SoundCrowd.</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={10} >
            <Header as="h2" block>Top Songs</Header>
            <Card fluid>
              <Card.Content>
                <WaveformGradient />
                <SongList songs={songs}/>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={4} >
            <Header block inverted>Latest Comments</Header>
            <CommentList userId={null} />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
        </Grid>
      );
  }
}

const mapState = (state) => {
  return {
    // sort the songs and take the top 50 for this component
    // we could have other songs in the state but we don't care about those right now
    songs: state.songs.sort((songA, songB) => songB.playcount - songA.playcount).slice(0, 50),
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchData: () => {
      // fetches the top 50 songs
      dispatch(fetchTopSongs(50));
    },
    clearData: () => dispatch(clearSongs()),
  };
};

export default connect(mapState, mapDispatch)(LandingPage);
