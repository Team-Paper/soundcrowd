import { combineReducers } from 'redux';
import isPlaying from './isPlaying';
import soundClips from './soundClips';

export default combineReducers({ isPlaying, soundClips });
