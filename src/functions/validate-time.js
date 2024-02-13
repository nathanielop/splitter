import { InvalidArgumentError } from 'commander';

// [[hh:]mm:]ss[.xxx] format
const timeRegexp = /((\d{2}:)?\d{2}:)?\d{2}(\.\d{3})?/;

export default ts => {
  if (ts && !timeRegexp.test(ts)) {
    throw new InvalidArgumentError(
      `Invalid time format. Please use [[hh:]mm:]ss[.xxx] format. Provided value: ${ts}`
    );
  }
  return ts;
};
