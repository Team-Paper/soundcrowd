import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';

// console.log(rootReducer);

const logger = createLogger({ collapsed: true });

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, /* logger */)),
);
