import axios from 'axios';
import context from '../../../context';

// ACTION TYPES
const ADD_SOUND_CLIP = 'ADD_SOUND_CLIP';

// ACTION CREATORS
export const addSoundClip = (fileId, soundClip) => ({
  type: ADD_SOUND_CLIP,
  soundClip,
  fileId,
});

// REDUCER
export default function reducer(soundClips = {}, action) {
  switch(action.type) {
    case ADD_SOUND_CLIP:
      const fileId = action.fileId;
      const newSoundClips = Object.assign({}, soundClips);
      newSoundClips[fileId] = action.soundClip;
      return newSoundClips;
    default:
      return soundClips;
  }
}

// THUNK CREATORS
export const createSoundClips = (files, soundClips) => dispatch => {
  return Promise.all(Object.entries(files).map(([key, file]) => {
    if (soundClips.hasOwnProperty(file.id)) {
      return;
    } else {
      return axios.get(file.url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(responseAudio => context.decodeAudioData(responseAudio))
        .then(audio => {
          let buffer = context.createBufferSource();
          console.log('decoding audio data');
          buffer.connect(context.destination);
          buffer.buffer = audio;
          dispatch(addSoundClip(file.id, {
            sound: buffer,
            played: false,
            duration: audio.duration,
          }));
        });
    }
  }))
  .catch(console.error);
}
