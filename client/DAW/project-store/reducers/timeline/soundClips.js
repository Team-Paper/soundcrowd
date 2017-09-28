// ACTION TYPES
const SET_SOUND_CLIPS = 'SET_SOUND_CLIPS';
const ADD_SOUND_CLIP = 'ADD_SOUND_CLIP';

// ACTION CREATORS
export const setSoundClips = soundClips => ({
  type: SET_SOUND_CLIPS,
  soundClips
});

export const addSoundClip = soundClip => ({
  type: ADD_SOUND_CLIP,
  soundClip,
})

// REDUCER
export default function reducer(soundClips = [], action) {
  switch(action.type) {
    case SET_SOUND_CLIPS:
      return action.soundClips;
    case ADD_SOUND_CLIP:
      return soundClips.concat(action.soundClip);
    default:
      return soundClips;
  }
}

// THUNK CREATORS
export const createSoundClips = (files) => dispatch => {
  return Promise.all(files.map(file => {
    return axios.get(file.url, { responseType: 'arraybuffer' })
      .then(res => res.data)
      .then(responseAudio => context.decodeAudioData(responseAudio))
      .then(audio => {
        addSoundClip({ sound: audio, time: file.startTime });
      })
  }))
  .catch(console.error);
}
