// ACTION TYPES
const SET_SELECTED_TRACKS = 'SET_SELECTED_TRACKS';
const ADD_SELECTED_TRACK = 'ADD_SELECTED_TRACK';

// ACTION CREATORS
export const setSelectedTracks = selectedTracks => ({
  type: SET_SELECTED_TRACKS,
  selectedTracks,
});

export const addSelectedTrack = trackId => ({
  type: ADD_SELECTED_TRACK,
  trackId,
});

// REDUCER
export default function reducer(selectedTracks = [], action) {
  switch (action.type) {
    case SET_SELECTED_TRACKS:
      return action.selectedTracks;
    case ADD_SELECTED_TRACK:
      return selectedTracks.indexOf(action.trackId) === -1 ?
        selectedTracks.concat(action.trackId) : selectedTracks;
    default:
      return selectedTracks;
  }
}
