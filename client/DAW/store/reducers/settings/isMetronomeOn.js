// ACTION TYPES
const SET_IS_METRONOME_ON = 'SET_IS_METRONOME_ON';

// ACTION CREATORS
export const setIsMetronomeOn = isMetronomeOn => ({
  type: SET_IS_METRONOME_ON,
  isMetronomeOn
});

// REDUCER
export default function reducer(isMetronomeOn = false, action) {
  switch(action.type) {
    case SET_IS_METRONOME_ON:
      return action.isMetronomeOn;
    default:
      return isMetronomeOn
  }
}
