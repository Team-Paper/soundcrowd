// ACTION TYPES
const START_RECORD = 'START_RECORD';
const STOP_RECORD = 'STOP_RECORD';

// ACTION CREATORS
export const startRecord = () => ({
  type: START_RECORD,
  isRecording: true,
});

export const stopRecord = () => ({
  type: STOP_RECORD,
  isRecording: false,
});

// REDUCER
export default function reducer(isRecording = false, action) {
  switch (action.type) {
    case START_RECORD:
      return action.isRecording;
    case STOP_RECORD:
      return action.isRecording;
    default:
      return isRecording;
  }
}
