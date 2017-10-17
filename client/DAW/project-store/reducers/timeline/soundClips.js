import axios from 'axios';
import context from '../../../context';
import { createWaveform } from '../../../waveformBuilder';

// ACTION TYPES
const ADD_SOUND_CLIP = 'ADD_SOUND_CLIP';
const SET_WAVEFORM = 'SET_WAVEFORM';

// ACTION CREATORS
export const addSoundClip = (fileId, soundClip) => ({
  type: ADD_SOUND_CLIP,
  soundClip,
  fileId,
});

export const setWaveform = (fileId, waveform) => ({
  type: SET_WAVEFORM,
  waveform,
  fileId,
});

// REDUCER
export default function reducer(soundClips = {}, action) {
  switch (action.type) {
    case ADD_SOUND_CLIP: {
      const fileId = action.fileId;
      const newSoundClips = Object.assign({}, soundClips);
      newSoundClips[fileId] = action.soundClip;
      return newSoundClips;
    }
    case SET_WAVEFORM: {
      const { fileId, waveform } = action;
      if (!soundClips[fileId]) return soundClips;
      const newSoundClips = Object.assign({}, soundClips);
      newSoundClips[fileId] = Object.assign({}, soundClips[fileId], { waveform });
      return newSoundClips;
    }
    default:
      return soundClips;
  }
}

// THUNK CREATORS
export const createSoundClips = (files, soundClips) => (dispatch) => {
  if (!files) return Promise.resolve([]);
  return Promise.all(Object.entries(files).map(([key, file]) => {
    if (soundClips.hasOwnProperty(key)) {
      return false;
    }
    return axios.get(`//d3oysef4ue4h90.cloudfront.net${file.url}`, { responseType: 'arraybuffer' })
      .then(res => res.data)
      .then(responseAudio => context.decodeAudioData(responseAudio))
      .then((audio) => {
        const buffer = context.createBufferSource();
        buffer.connect(context.destination);
        buffer.buffer = audio;
        dispatch(addSoundClip(file.id, {
          sound: buffer,
          duration: audio.duration,
          waveform: createWaveform(audio),
        }));
        return true;
      });
  }))
    .catch(console.error);
};
