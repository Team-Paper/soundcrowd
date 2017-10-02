// ACTION TYPES
const SET_SELECTED_TRACKS = 'SET_SELECTED_TRACKS';

// ACTION CREATORS
export const setSelectedTracks = selectedTracks => ({
  type: SET_SELECTED_TRACKS,
  selectedTracks
});

// REDUCER
export default function reducer(selectedTracks = [], action) {
  switch(action.type) {
    case SET_SELECTED_TRACKS:
      return action.selectedTracks;
    default:
      return selectedTracks;
  }
}
