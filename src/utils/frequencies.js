export const formatFrequency = frequency => {
  if (frequency < 1000) {
    return `${frequency} Hz`;
  }

  const value = (frequency / 1000).toFixed(1);
  return `${value} kHz`;
};
