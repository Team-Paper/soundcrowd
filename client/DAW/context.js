// REVIEW: NICE dependency injection
let context = new (window.AudioContext || window.webkitAudioContext)();

console.log('context file ran');

export default context;
