import axios from './axios'

/**
 * ACTION TYPES
 */
const GET_SONG = 'GET_SONG';
const REMOVE_SONG = 'REMOVE_SONG';
const GET_SOME_SONGS = 'GET_SOME_SONGS';
const CLEAR_SONGS = 'CLEAR_SONGS';

/**
 * INITIAL STATE
 */
const defaultSongs = [];

/**
 * ACTION CREATORS
 */
export const getSong = song => ({ type: GET_SONG, song });
export const removeSong = song => ({ type: REMOVE_SONG, song });
export const getSomeSongs = songs => ({ type: GET_SOME_SONGS, songs });
export const clearSongs = () => ({ type: CLEAR_SONGS });

/**
 * THUNK CREATORS
 */

export const fetchTopSongs = (numSongs) => {
  return (dispatch) => {
    return axios.get(`/api/songs/top/${numSongs}`)
      .then(res => res.data)
      .then(songs => dispatch(getSomeSongs(songs)))
      .catch(console.error.bind(console))
  }
}

export const fetchSong = (id) => {
  return (dispatch) => {
    return axios.get(`/api/songs/${id}`)
      .then(res => res.data)
      .then(song => dispatch(getSong(song)))
      .catch(console.error.bind(console))
  }
}

export const fetchUserSongs = (userId) => {
  return (dispatch) => {
    return axios.get(`/api/users/${userId}/songs`)
      .then(res => res.data)
      .then(songs => dispatch(getSomeSongs(songs)))
      .catch(console.error.bind(console))
  }
}

/**
 * REDUCER
 */
export default function (state = defaultSongs, action) {
  switch (action.type) {
    case GET_SONG:
      return [...state, action.song];
    case GET_SOME_SONGS:
      return action.songs;
    case REMOVE_SONG:
      return state.filter(song => song.id !== action.song.id);
    case CLEAR_SONGS:
      return defaultSongs;
    default:
      return state;
  }
}
