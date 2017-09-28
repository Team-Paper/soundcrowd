// ACTION TYPES
const SET_TEMPO = 'SET_TEMPO';

// ACTION CREATORS
export const setTempo = tempo => ({
  type: SET_TEMPO,
  tempo
});

// REDUCER
export default function reducer(tempo = 0, action) {
  switch(action.type) {
    case SET_TEMPO:
      return action.tempo;
    default:
      return tempo;
  }
}
