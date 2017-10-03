// ACTION TYPES
const SET_START_RECORD_TIME = 'SET_START_RECORD_TIME';

// ACTION CREATORS
export const setStartRecordTime = startRecordTime => ({
  type: SET_START_RECORD_TIME,
  startRecordTime,
});

// REDUCER
export default function reducer(startRecordTime = 0, action) {
  switch(action.type) {
    case SET_START_RECORD_TIME:
      return action.startRecordTime;
    default:
      return startRecordTime;
  }
}
