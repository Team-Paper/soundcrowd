// ACTION TYPES
const SET_PLAYED_AT = 'SET_PLAYED_AT';

// ACTION CREATORS
export const setStart = playedAt => ({
  type: SET_PLAYED_AT,
  playedAt
});

// REDUCER
export default function reducer(playedAt = 0, action) {
  switch(action.type) {
    case SET_PLAYED_AT:
      return action.playedAt;
    default:
      return playedAt;
  }
}
