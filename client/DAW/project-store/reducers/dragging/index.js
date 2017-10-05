// DEFAULT STATE
const defaultDrag = {
  isDragging: false,
};

// ACTION TYPES
const START_DRAGGING = 'START_DRAGGING';
const STOP_DRAGGING = 'STOP_DRAGGING';

// ACTION CREATORS
export const startDragging = () => ({
  type: START_DRAGGING,
});

export const stopDragging = () => ({
  type: STOP_DRAGGING,
});

// REDUCER
export default function reducer(dragging = defaultDrag, action) {
  switch (action.type) {
    case START_DRAGGING:
      return { isDragging: true };
    case STOP_DRAGGING:
      return defaultDrag;
    default:
      return dragging;
  }
}
