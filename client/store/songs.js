import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SONG = 'GET_USER';
const REMOVE_SONG = 'REMOVE_SONG';
const GET_SOME_SONGS = 'GET_SOME_SONGS';

/**
 * INITIAL STATE
 */
const defaultSongs = [];

/**
 * ACTION CREATORS
 */
const getSong = song => ({ type: GET_SONG, song });
const removeSong = song => ({ type: REMOVE_SONG, song });
const getSomeSongs = songs => ({ type: GET_SOME_SONGS, songs });


/**
 * THUNK CREATORS
 */

const fetchTopSongs = (numSongs) => {
  return (dispatch) => {
    return axios.get(`/api/songs/top/${numSongs}`)
      .then(songs => dispatch(getSomeSongs(songs)))
      .catch(console.error.bind(console))
  }
}

const fetchSong = (id) => {
  return (dispatch) => {
    return axios.get(`/api/songs/${id}`)
      .then(song => dispatch(getSong(song)))
      .catch(console.error.bind(console))
  }
}

const fetchUserSongs = (userId) => {
  return (dispatch) => {
    return axios.get(`/api/users/${userId}/songs`)
      .then(songs => dispatch(getSomeSongs(songs)))
      .catch(console.error.bind(console))
  }
}

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_SONG:
      return [...state, action.song];
    case GET_SOME_SONGS:
      return [...state, ...action.songs];
    case REMOVE_SONG:
      return [...state].filter(song => song.id !== action.song.id);
    default:
      return state;
  }
}
