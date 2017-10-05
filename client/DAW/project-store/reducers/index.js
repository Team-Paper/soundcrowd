import { combineReducers } from 'redux';
import clips from './clips';
import dragging from './dragging';
import files from './files';
import settings from './settings';
import tracks from './tracks';
import timeline from './timeline';
import reverbs from './reverbs';

export default combineReducers({ clips, dragging, files, tracks, settings, timeline, reverbs });
