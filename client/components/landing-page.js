import React from 'react';
import { connect } from 'react-redux';
import { Item, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { fetchTopSongs } from '../store';

/**
 * COMPONENT
 */
class LandingPage extends React.Component {
  componentDidMount() {
    if (this.props.fetchData) this.props.fetchData();
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.fetchData && newProps.fetchData) {
      newProps.fetchData();
    }
  }

  render() {
    if (!this.props.songs) return <div />;

    return (
      <div>
        <Header>Top 50 Songs</Header>
        <Item.Group relaxed>
          {
            this.props.songs.map((song, index) => {
              return (
                <Item key={song.id}>
                  <Item.Image src={song.imageUrl || 'http://via.placeholder.com/150x150'} />
                  <Item.Content>
                    <Item.Header>
                      <Header>#{index + 1}: {song.title}</Header>
                    </Item.Header>
                    <Item.Description>
                      <br /><br />
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
      </div>
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
  };
};

/**
 * PROP TYPES
 */
LandingPage.propTypes = {
  fetchData: PropTypes.func.isRequired,
  songs: PropTypes.array.isRequired,
};

export default connect(mapState, mapDispatch)(LandingPage);
