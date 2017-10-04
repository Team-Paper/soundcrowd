import firebase from '../../../../firebase';

// ACTION TYPES
const SET_TRACKS = 'SET_TRACKS';

// ACTION CREATORS
export const setTracks = tracks => ({
  type: SET_TRACKS,
  tracks,
})

// REDUCER
export default function reducer(tracks = {}, action) {
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
  tracks.forEach(track => {
    firebase.database().ref(`${projectId}/tracks/${track.id}`).set(track);
  });
};

export const toggleMuteTrackThunk = (projectId, track) => dispatch => {
  console.log('muteTrackThunk triggered');
  const val = !track.isMuted;
  firebase.database().ref(`${projectId}/tracks/${track.id}/isMuted`).set(val);
};

export const setTrackVolume = (projectId, track, newVolume) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/volume`).set(+newVolume);
}
