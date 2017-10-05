// DEFAULT STATE
const defaultDrag = {
  isDragging: false,
  file: 0,
};

// ACTION TYPES
const START_DRAGGING = 'START_DRAGGING';
const STOP_DRAGGING = 'STOP_DRAGGING';

// ACTION CREATORS
export const startDragging = file => ({
  type: START_DRAGGING,
  file,
});

export const stopDragging = () => ({
  type: STOP_DRAGGING,
});

// REDUCER
export default function reducer(dragging = defaultDrag, action) {
  switch (action.type) {
    case START_DRAGGING:
      return { isDragging: true, file: action.file };
    case STOP_DRAGGING:
      return defaultDrag;
    default:
      return dragging;
  }
}
