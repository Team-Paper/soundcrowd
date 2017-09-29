import axios from 'axios';
import context from '../../../context';

// ACTION TYPES
const SET_SOUND_CLIPS = 'SET_SOUND_CLIPS';
const ADD_SOUND_CLIP = 'ADD_SOUND_CLIP';
const REMOVE_SOUND_CLIP = 'REMOVE_SOUND_CLIP';

// ACTION CREATORS
export const setSoundClips = soundClips => ({
  type: SET_SOUND_CLIPS,
  soundClips
});

export const addSoundClip = soundClip => ({
  type: ADD_SOUND_CLIP,
  soundClip,
});

export const removeSoundClip = soundClip => ({
  type: REMOVE_SOUND_CLIP,
  soundClip,
})

// REDUCER
export default function reducer(soundClips = [], action) {
  switch(action.type) {
    case SET_SOUND_CLIPS:
      return action.soundClips;
    case ADD_SOUND_CLIP:
      return soundClips.concat(action.soundClip);
    case REMOVE_SOUND_CLIP:
      return soundClips.filter(soundClip => soundClip.time !== action.soundClip.time)
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
        let buffer = context.createBufferSource();
        console.log('decoding audio data');
        buffer.connect(context.destination);
        buffer.buffer = audio;
        dispatch(addSoundClip({ sound: buffer, time: file.startTime }));
      })
  }))
  .catch(console.error);
}
