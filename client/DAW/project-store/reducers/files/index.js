
// ACTION TYPES
const SET_FILES = 'SET_FILES';

// ACTION CREATORS
export const setFiles = files => ({
  type: SET_FILES,
  files,
});

// REDUCER
export default function reducer(files = [], action) {
  switch(action.type) {
    case SET_FILES:
      return action.files;
    default:
      return files;
  }
}
