import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchTopSongs } from '../store'

/**
 * COMPONENT
 */
class LandingPage extends React.Component {
  componentDidMount() {
    if (this.props.fetchData) this.props.fetchData();
  }

  componentWillReceiveProps (newProps) {
    if (!this.props.fetchData && newProps.fetchData) {
      newProps.fetchData();
    }
  }

  render() {
    if (!this.props.songs) return <div />

    return (
      <div>
        {
          this.props.songs.map(song => {
            console.log("Current song is this: ", song)
            return (
              <div key={song.id}>
                <h4>{song.title}</h4>
                <audio controls>
                  <source src={song.url} type="audio/mp3" />
                </audio>
              </div>
            )
          })
        }
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    //sort the songs and take the top 50 for this component
    //we could have other songs in the state but we don't care about those right now
    songs: state.songs.sort((songA, songB) => songB.playcount - songA.playcount).slice(0, 50)
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchData: () => {
      //fetches the top 50 songs
      dispatch(fetchTopSongs(50));
    }
  }
}

// /**
//  * PROP TYPES
//  */
// LandingPage.propTypes = {
//   fetchData: PropTypes.func.isRequired,
//   songs: PropTypes.array.isRequired
// }

export default connect(mapState, mapDispatch)(LandingPage);
