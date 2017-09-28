import { combineReducers } from 'redux';
import tempo from './tempo';
import isMetronomeOn from './isMetronomeOn';

export default combineReducers({ tempo, isMetronomeOn });
