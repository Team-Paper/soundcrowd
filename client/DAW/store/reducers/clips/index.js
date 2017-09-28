
// ACTION TYPES
const SET_CLIPS = 'SET_CLIPS';

// ACTION CREATORS
export const setClips = clips => ({
  type: SET_CLIPS,
  clips,
})

// REDUCER
export default function reducer(clips = [], action) {
  switch(action.type) {
    default:
      return clips;
  }
}
