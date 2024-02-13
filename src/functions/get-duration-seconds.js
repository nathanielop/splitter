export default ts => {
  const [ss, mm = 0, hh = 0] = ts.split(':').reverse().map(Number);
  return hh * 3600 + mm * 60 + ss;
};
