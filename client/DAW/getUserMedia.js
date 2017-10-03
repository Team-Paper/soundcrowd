// REVIEW: nice dependency injection
navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia;

export default navigator.getUserMedia;
