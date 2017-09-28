import { combineReducers } from 'redux';
import isPlaying from './isPlaying';
import soundClips from './soundClips';
import time from './time';
import start from './start';

export default combineReducers({ isPlaying, soundClips, time, start });
