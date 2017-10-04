import React from 'react';

const wavePath = (waveform) => {
  const length = waveform.length;
  let path = 'M0,50';
  for (let i = 0; i < length; i++) {
    path += ` L${i},${50 - (50 * waveform[i][0])}`;
  }
  for (let i = length - 1; i >= 0; i--) {
    path += ` L${i},${50 - (50 * waveform[i][1])}`;
  }
  return path;
};

const Waveform = (props) => {
  const { waveform } = props;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${waveform.length} 100`}>
      <path d={wavePath(waveform)} />
    </svg>
  );
};

export default Waveform;
