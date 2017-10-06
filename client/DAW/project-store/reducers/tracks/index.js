import firebase from '../../../../firebase';

// ACTION TYPES
const SET_TRACKS = 'SET_TRACKS';

// ACTION CREATORS
export const setTracks = tracks => ({
  type: SET_TRACKS,
  tracks,
})

// REDUCER
export default function reducer(tracks = {}, action) {
  switch(action.type) {
    case SET_TRACKS:
      return action.tracks;
    default:
      return tracks;
  }
}

// THUNK CREATORS
export const setTracksThunk = (projectId, tracks) => dispatch => {
  console.log('setTracksThunk fired', tracks);
  tracks.forEach(track => {
    firebase.database().ref(`${projectId}/tracks/${track.id}`).set(track);
  });
};

export const toggleMuteTrackThunk = (projectId, track) => dispatch => {
  const val = !track.isMuted;
  firebase.database().ref(`${projectId}/tracks/${track.id}/isMuted`).set(val);
};

export const setTrackVolume = (projectId, track, newVolume) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/volume`).set(+newVolume);
};

export const setTrackReverbGain = (projectId, track, newGain) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/reverb/gain`).set(+newGain);
};

export const toggleTrackReverb = (projectId, track) => dispatch => {
  const val = !track.reverb.on;
  firebase.database().ref(`${projectId}/tracks/${track.id}/reverb/on`).set(val);
};

export const setTrackEQBandGain = (projectId, track, band, newGain) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/eq/bands/${band}/gain/`).set(+newGain);
};

export const toggleTrackEQ = (projectId, track) => dispatch => {
  const val = !track.eq.on;
  firebase.database().ref(`${projectId}/tracks/${track.id}/eq/on/`).set(val);
}

export const deleteTrack = (projectId, track) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track}`).remove();
}

export const toggleTrackCompressor = (projectId, track) => dispatch => {
  const val = !track.compressor.on;
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/on/`).set(val);
};

export const setTrackCompressorThreshold = (projectId, track, newThreshold) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/threshold`).set(+newThreshold);
};

export const setTrackCompressorKnee = (projectId, track, newKnee) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/knee`).set(+newKnee);
};

export const setTrackCompressorRatio = (projectId, track, newRatio) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/ratio`).set(+newRatio);
};

export const setTrackCompressorAttack = (projectId, track, newAttack) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/attack`).set(+newAttack);
};

export const setTrackCompressorRelease = (projectId, track, newRelease) => dispatch => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/release`).set(+newRelease);
};

export const addTrackThunk = (projectId, trackId, newTrack) => dispatch => {
  console.log('in thunk')
  firebase.database().ref(`${projectId}/tracks/${trackId}`).set(newTrack);
}
