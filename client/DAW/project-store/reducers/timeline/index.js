import { combineReducers } from 'redux';
import isPlaying from './isPlaying';
import soundClips from './soundClips';
import time from './time';
import start from './start';
import playedAt from './playedAt';
import selectedTracks from './selectedTracks';
import startRecordTime from './startRecordTime';
import isMetronomeOn from './isMetronomeOn';
import isRecording from './isRecording';

export default combineReducers({ isPlaying, soundClips, time, start, playedAt, selectedTracks, startRecordTime, isMetronomeOn, isRecording });
