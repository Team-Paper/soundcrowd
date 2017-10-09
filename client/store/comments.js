import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_COMMENT = 'GET_COMMENT';
const GET_SOME_COMMENTS = 'GET_SOME_COMMENTS';
const SET_COMMENTS = 'SET_COMMENTS';

/**
 * INITIAL STATE
 */
const defaultComments = [];

/**
 * ACTION CREATORS
 */
export const getComment = comment => ({ type: GET_COMMENT, comment });
export const getSomeComments = comments => ({ type: GET_SOME_COMMENTS, comments });
export const setComments = comments => ({ type: SET_COMMENTS, comments });

/**
 * THUNK CREATORS
 */

// fetch all comments for a song
export const fetchSongComments = (songId) => {
  return (dispatch) => {
    return axios.get(`/api/songs/${songId}/comments`)
      .then(res => res.data)
      .then(comments => dispatch(getSomeComments(comments)))
      .catch(console.error.bind(console))
  };
};

// fetch all comments for a user
export const fetchUserComments = (userId) => {
  return (dispatch) => {
    return axios.get(`/api/users/${userId}/comments`)
      .then(res => res.data)
      .then(comments => dispatch(getSomeComments(comments)))
      .catch(console.error.bind(console))
  };
};

export const postComment = (comment) => {
  return (dispatch) => {
    return axios.post('/api/comments', comment)
      .then(res => res.data)
      // Intentially returns the comment passed to postComment
      // This avoids a ton of eager loading which would be complicated
      // to implement and would not add much value to the code in other cases
      .then(({ id }) => dispatch(getComment({ ...comment, id })))
      .catch(console.error.bind(console));
  };
};

export const fetchCommentsAboutUser = (userId) => dispatch => {
  axios.get(`/api/users/${userId}/comments-about`)
    .then(res => res.data)
    .then(comments => dispatch(setComments(comments)))
    .catch(console.error);
}

/**
 * REDUCER
 */
export default function (state = defaultComments, action) {
  switch (action.type) {
    case GET_COMMENT:
      return [...state, action.comment];
    case GET_SOME_COMMENTS:
      return [].concat(action.comments, state);
    case SET_COMMENTS:
      return action.comments;
    default:
      return state;
  }
}
