import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchTopSongs } from '../store'

/**
 * COMPONENT
 */
class LandingPage extends React.Component {
  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    <div>

    </div>
  }

}

const mapState = (state) => {
  return {
    songs: state.songs.sort((songA, songB) => songB.playcount - songA.playcount).slice(0, 50)
  }
}

const mapDispatch = (dispatch) => {
  {
    fetchData: () => {
      //fetches the top 50 songs
      dispatch(fetchTopSongs(50));
    }
  }
}

/**
 * PROP TYPES
 */
Main.propTypes = {
  fetchData: PropTypes.func.isRequired,
  songs: PropTypes.array.isRequired
}

export default connect(mapState, mapDispatch)(LandingPage);
