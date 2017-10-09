import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import user from './user';
import songs from './songs';
import comments from './comments';
import users from './users';
import projects from './projects';
import collaborators from './collaborators';

const reducer = combineReducers({
  user,
  songs,
  comments,
  users,
  projects,
  collaborators,
});

const middleware = applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }));
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './songs';
export * from './comments';
export * from './users';
export * from './projects';
export * from './collaborators';
