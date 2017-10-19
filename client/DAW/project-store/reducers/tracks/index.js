import firebase from '../../../../firebase';

// ACTION TYPES
const SET_TRACKS = 'SET_TRACKS';

// ACTION CREATORS
export const setTracks = tracks => ({
  type: SET_TRACKS,
  tracks,
});

// REDUCER
export default function reducer(tracks = {}, action) {
  switch (action.type) {
    case SET_TRACKS:
      return action.tracks;
    default:
      return tracks;
  }
}

// THUNK CREATORS
export const setTracksThunk = (projectId, tracks) => () => {
  tracks.forEach((track) => {
    firebase.database().ref(`${projectId}/tracks/${track.id}`).set(track);
  });
};

export const toggleMuteTrackThunk = (projectId, track) => () => {
  const val = !track.isMuted;
  firebase.database().ref(`${projectId}/tracks/${track.id}/isMuted`).set(val);
};

export const setTrackVolume = (projectId, track, newVolume) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/volume`).set(+newVolume);
};

export const setName = (projectId, track, newName) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/name`).set(newName);
};

export const setTrackReverbGain = (projectId, track, newGain) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/reverb/gain`).set(+newGain);
};

export const toggleTrackReverb = (projectId, track) => () => {
  const val = !track.reverb.on;
  firebase.database().ref(`${projectId}/tracks/${track.id}/reverb/on`).set(val);
};

export const setTrackReverb = (projectId, track, reverbId) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/reverb/id`).set(+reverbId);
};

export const setTrackEQBandGain = (projectId, track, band, newGain) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/eq/bands/${band}/gain/`).set(+newGain);
};

export const toggleTrackEQ = (projectId, track) => () => {
  const val = !track.eq.on;
  firebase.database().ref(`${projectId}/tracks/${track.id}/eq/on/`).set(val);
};

export const deleteTrack = (projectId, track) => () => {
  firebase.database().ref(`${projectId}/tracks/${track}`).remove();
};

export const toggleTrackCompressor = (projectId, track) => () => {
  const val = !track.compressor.on;
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/on/`).set(val);
};

export const setTrackCompressorThreshold = (projectId, track, newThreshold) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/threshold`).set(+newThreshold);
};

export const setTrackCompressorKnee = (projectId, track, newKnee) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/knee`).set(+newKnee);
};

export const setTrackCompressorRatio = (projectId, track, newRatio) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/ratio`).set(+newRatio);
};

export const setTrackCompressorAttack = (projectId, track, newAttack) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/attack`).set(+newAttack);
};

export const setTrackCompressorRelease = (projectId, track, newRelease) => () => {
  firebase.database().ref(`${projectId}/tracks/${track.id}/compressor/release`).set(+newRelease);
};

export const addTrackThunk = (projectId, trackId, newTrack) => () => {
  firebase.database().ref(`${projectId}/tracks/${trackId}`).set(newTrack);
};
