// ACTION TYPES
const SET_SOUND_CLIPS = 'SET_SOUND_CLIPS';

// ACTION CREATORS
export const setSoundClips = soundClips => ({
  type: SET_SOUND_CLIPS,
  soundClips
});

// REDUCER
export default function reducer(soundClips = [], action) {
  switch(action.type) {
    case SET_SOUND_CLIPS:
      return action.soundClips;
    default:
      return soundClips;
  }
}

// THUNK CREATORS
export const createSoundClips = () => dispatch => {
  // for each file, get it, turn it into a buffer source, and put it into the soundClips array
}
