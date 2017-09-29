import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_COMMENT = 'GET_COMMENT';
const GET_SOME_COMMENTS = 'GET_SOME_COMMENTS';

/**
 * INITIAL STATE
 */
const defaultComments = [];

/**
 * ACTION CREATORS
 */
export const getComment = comment => ({ type: GET_COMMENT, comment });
export const getSomeComments = comments => ({ type: GET_SOME_COMMENTS, comments });


/**
 * THUNK CREATORS
 */

export const fetchSongComments = (songId) => {
  return (dispatch) => {
    return axios.get(`/api/songs/${songId}/comments`)
      .then(res => res.data)
      .then(comments => dispatch(getSomeComments(comments)))
      .catch(console.error.bind(console))
  };
};

/**
 * REDUCER
 */
export default function (state = defaultComments, action) {
  switch (action.type) {
    case GET_COMMENT:
      return [...state, action.comment];
    case GET_SOME_COMMENTS:
      return [].concat(action.comments, state);
    default:
      return state;
  }
}
