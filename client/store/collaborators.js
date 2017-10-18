import axios from 'axios';

// ACTION TYPES
const SET_COLLABORATORS = 'SET_COLLABORATORS';

// ACTION CREATORS
export const setCollaborators = collaborators => ({
  type: SET_COLLABORATORS,
  collaborators,
});

// REDUCER
export default function reducer(collaborators = [], action) {
  switch (action.type) {
    case SET_COLLABORATORS:
      return action.collaborators;
    default:
      return collaborators;
  }
}

// THUNK CREATORS
export const fetchCollaborators = userId => (dispatch) => {
  axios.get(`/api/users/${userId}/collaborators`)
    .then(res => res.data)
    .then(collaborators => dispatch(setCollaborators(collaborators)))
    .catch(console.error);
};
