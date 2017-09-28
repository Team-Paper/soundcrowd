// ACTION TYPES
const SET_IS_PLAYING = 'SET_IS_PLAYING';

// ACTION CREATORS
export const setIsPlaying = isPlaying => ({
  type: SET_IS_PLAYING,
  isPlaying
});

// REDUCER
export default function reducer(isPlaying = false, action) {
  switch(action.type) {
    case SET_IS_PLAYING:
      return action.isPlaying;
    default:
      return isPlaying
  }
}
