export const formatDuration = (initialSecs, maxSecs) => {
  const secs = maxSecs && initialSecs > maxSecs ? maxSecs : initialSecs;
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const lastSecs = Math.floor(secs % 60);
  const lastMins = Math.floor(mins % 60);

  const stringMins = lastMins > 9 ? lastMins : `0${lastMins}`;
  const stringSecs = lastSecs > 9 ? lastSecs : `0${lastSecs}`;
  const hoursPrefix = hours > 0 ? `${hours}:` : "";
  return `${hoursPrefix}${stringMins}:${stringSecs}`;
};
