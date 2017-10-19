import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_ONE_USER = 'GET_ONE_USER';
const GET_ALL_USERS = 'GET_ALL_USERS';
const REMOVE_USER = 'REMOVE_USER';
const UPDATE_USER = 'UPDATE_USER';

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
export const updateOneUser = user => ({ type: UPDATE_USER, user });

/**
 * THUNK CREATORS
 */

export const fetchUser = userId => (dispatch) => {
  axios.get(`/api/users/${userId}`)
    .then(res => res.data)
    .then(user => dispatch(getUser(user)))
    .catch(console.error.bind(console));
};

export const updateUser = user => (dispatch) => {
  axios.put(`/api/users/${user.id}`, user)
    .then(res => res.data)
    .then(updatedUser => dispatch(updateOneUser(updatedUser)))
    .catch(console.error.bind(console));
};

export const fetchAllUsers = () => (dispatch) => {
  axios.get('/api/users/')
    .then(res => res.data)
    .then(users => dispatch(getAllUsers(users)))
    .catch(console.error.bind(console));
};

export const fetchFriends = () => (dispatch) => {
  axios.get('/auth/facebook/friends')
    .then(res => res.data)
    .then(users => dispatch(getAllUsers(users)))
    .catch(console.error.bind(console));
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
    case UPDATE_USER:
      return state.filter((user) => {
        if (user.id !== action.user.id) return user;
        return action.user;
      });
    default:
      return state;
  }
}
