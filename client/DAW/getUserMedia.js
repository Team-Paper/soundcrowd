const navigator = navigator || {};

navigator.getUserMedia = navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia;

export default navigator.getUserMedia;
