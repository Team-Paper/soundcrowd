import firebase from '../../../../firebase';

// ACTION TYPES
const SET_TRACKS = 'SET_TRACKS';

// ACTION CREATORS
export const setTracks = tracks => ({
  type: SET_TRACKS,
  tracks,
})

// REDUCER
export default function reducer(tracks = [], action) {
  switch(action.type) {
    case SET_TRACKS:
      return action.tracks;
    default:
      return tracks;
  }
}

// THUNK CREATORS
export const setTracksThunk = (projectId, tracks) => dispatch => {
  console.log('setTracksThunk fired', tracks);
  firebase.database().ref(`${projectId}/tracks`).set(tracks);
};
