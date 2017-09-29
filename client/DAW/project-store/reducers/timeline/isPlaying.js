// ACTION TYPES
const SET_IS_PLAYING = 'SET_IS_PLAYING';
const PLAY = 'PLAY';
const PAUSE = 'PAUSE';

// ACTION CREATORS
export const setIsPlaying = isPlaying => ({
  type: SET_IS_PLAYING,
  isPlaying
});

export const play = () => ({
  type: PLAY,
  isPlaying: true,
});

export const pause = () => ({
  type: PAUSE,
  isPlaying: false,
})

// REDUCER
export default function reducer(isPlaying = false, action) {
  switch(action.type) {
    case SET_IS_PLAYING:
      return action.isPlaying;
    case PLAY:
      return action.isPlaying;
    case PAUSE:
      return action.isPlaying;
    default:
      return isPlaying
  }
}
