import axios from 'axios';
import context from '../../../context';

// ACTION TYPES
const SET_REVERBS = 'SET_REVERBS';
const ADD_REVERB = 'ADD_REVERB';

// ACTION CREATORS
export const setReverbs = reverbs => ({
  type: SET_REVERBS,
  reverbs,
});

export const addReverb = reverb => ({
  type: ADD_REVERB,
  reverb,
});

// REDUCER
export default function reducer(reverbs = {}, action) {
  switch (action.type) {
    case SET_REVERBS:
      return action.reverbs;
    case ADD_REVERB: {
      const newReverbs = Object.assign({}, reverbs);
      newReverbs[action.reverb.id] = action.reverb;
      return newReverbs;
    }
    default:
      return reverbs;
  }
}

// THUNK CREATORS
export const fetchReverbsThunk = reverbs => (dispatch) => {
  Promise.all(Object.entries(reverbs).map(([key, reverb]) => (
    axios.get(`/reverbs/${reverb.filename}`, { responseType: 'arraybuffer' })
  )
    .then(res => res.data)
    .then(responseAudio => context.decodeAudioData(responseAudio))
    .then((audio) => {
      const buffer = context.createBufferSource();
      buffer.connect(context.destination);
      buffer.buffer = audio;
      dispatch(addReverb({ id: reverb.id, audio: buffer, title: reverb.title }));
    })));
};
