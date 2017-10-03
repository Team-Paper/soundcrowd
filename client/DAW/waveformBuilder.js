export const createWaveform = buffer => {
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    console.log(buffer.getChannelData(c));
  }
};
