import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_ONE_USER = 'GET_ONE_USER';
const GET_ALL_USERS = 'GET_ALL_USERS';
const REMOVE_USER = 'REMOVE_USER';

/**
 * INITIAL STATE
 */
const defaultUsers = [];

/**
 * ACTION CREATORS
 */
export const getUser = user => ({ type: GET_ONE_USER, user });
export const removeUser = user => ({ type: REMOVE_USER, user });
export const getAllUsers = users => ({ type: GET_ALL_USERS, users });

/**
 * THUNK CREATORS
 */

export const fetchUser = (userId) => {
  return (dispatch) => {
    axios.get(`/api/users/${userId}`)
      .then(res => res.data)
      .then(user => dispatch(getUser(user)))
      .catch(console.error.bind(console));
  };
};

export const fetchAllUsers = () => {
  return (dispatch) => {
    axios.get('/api/users/')
      .then(res => res.data)
      .then(users => dispatch(getAllUsers(users)))
      .catch(console.error.bind(console));
  };
};

/**
 * REDUCER
 */
export default function (state = defaultUsers, action) {
  switch (action.type) {
    case GET_ONE_USER:
      return [...state, action.user];
    case REMOVE_USER:
      return state.filter(user => user.id !== action.user.id);
    case GET_ALL_USERS:
      return action.users;
    default:
      return state;
  }
}
