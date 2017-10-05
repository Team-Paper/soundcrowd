export const createWaveform = (buffer) => {
  const sampleSize = 200;
  const sampleStep = 20;
  const length = Math.floor(buffer.length / sampleSize);
  const peaks = new Array(length);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const chan = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      const start = Math.floor(i * sampleSize);
      const end = Math.floor(start + sampleSize);
      let min = 0;
      let max = 0;

      for (let j = start; j < end; j += sampleStep) {
        const value = chan[j];

        if (value > max) {
          max = value;
        }

        if (value < min) {
          min = value;
        }
      }
      const minMax = [min, max];
      if (peaks[i]) peaks[i].map((val, index) => (val * minMax[index]) / 2);
      else peaks[i] = minMax;
    }
  }
  return peaks;
};
