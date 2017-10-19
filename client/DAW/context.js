/* global AudioContext webkitAudioContext */

const context = new (AudioContext || webkitAudioContext)();

export default context;
