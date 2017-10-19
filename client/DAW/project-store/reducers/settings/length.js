import firebase from '../../../../firebase';

// ACTION TYPES
const SET_LENGTH = 'SET_LENGTH';

// ACTION CREATORS
export const setLength = length => ({
  type: SET_LENGTH,
  length,
});

// REDUCER
export default function reducer(length = 10, action) {
  switch (action.type) {
    case SET_LENGTH:
      return action.length;
    default:
      return length;
  }
}

// THUNK CREATORS
export const setLengthThunk = (projectId, length) => () => {
  firebase.database().ref(`${projectId}/settings/length`).set(+length);
};
