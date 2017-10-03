import firebase from '../../../../firebase';

// ACTION TYPES
const SET_CLIPS = 'SET_CLIPS';

// ACTION CREATORS
export const setClips = clips => ({
  type: SET_CLIPS,
  clips,
})

// REDUCER
export default function reducer(clips = [], action) {
  switch(action.type) {
    case SET_CLIPS:
      return action.clips;
    default:
      return clips;
  }
}

// THUNK CREATORS
export const setClipsThunk = (projectId, clips) => dispatch => {
  clips.forEach(clip => {
    firebase.database().ref(`${projectId}/clips`).push(clip);
  });
};

export const addClipThunk = (projectId, fileId, selectedTracks, time) => dispatch => {
  console.log('time is', time);
  selectedTracks.forEach(selectedTrack => {
    const newClip = { fileId, track: selectedTrack, startTime: time }
    firebase.database().ref(`${projectId}/clips`).push(newClip);
  });
}
