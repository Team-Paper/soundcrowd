// ACTION TYPES
const SET_TIME = 'SET_TIME';

// ACTION CREATORS
export const setTime = time => ({
  type: SET_TIME,
  time
});

// REDUCER
export default function reducer(time = 0, action) {
  switch(action.type) {
    case SET_TIME:
      return action.time;
    default:
      return time;
  }
}
