import { existsSync } from 'node:fs';

import { InvalidArgumentError } from 'commander';

export default path => {
  if (!existsSync(path)) {
    throw new InvalidArgumentError(`Invalid file path: ${path}`);
  }
  return path;
};
