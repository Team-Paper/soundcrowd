// DEFAULT STATE
const defaultDrag = {
  isDragging: false,
  trackOver: 0,
};

// ACTION TYPES
const START_DRAGGING = 'START_DRAGGING';
const STOP_DRAGGING = 'STOP_DRAGGING';
const SET_TRACK_OVER = 'SET_TRACK_OVER';

// ACTION CREATORS
export const startDragging = () => ({
  type: START_DRAGGING,
});

export const stopDragging = () => ({
  type: STOP_DRAGGING,
});

export const setTrackOver = trackOver => ({
  type: SET_TRACK_OVER,
  trackOver,
});

// REDUCER
export default function reducer(dragging = defaultDrag, action) {
  switch (action.type) {
    case START_DRAGGING:
      return { isDragging: true, trackOver: 0 };
    case STOP_DRAGGING:
      return defaultDrag;
    case SET_TRACK_OVER:
      return dragging.isDragging ?
        Object.assign({}, dragging, { trackOver: action.trackOver }) :
        dragging;
    default:
      return dragging;
  }
}
