// ACTION TYPES
const SET_START = 'SET_START';

// ACTION CREATORS
export const setStart = start => ({
  type: SET_START,
  start,
});

// REDUCER
export default function reducer(start = 0, action) {
  switch (action.type) {
    case SET_START:
      return action.start;
    default:
      return start;
  }
}

// THUNK CREATORS
export const setStartThunk = start => dispatch => Promise.resolve(dispatch(setStart(start)));
