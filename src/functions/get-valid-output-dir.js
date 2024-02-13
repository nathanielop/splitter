import fs from 'node:fs/promises';

import outputBase from '../constants/output-base.js';

export default async dir => {
  const existingFiles = await fs.readdir(dir);

  let i = 0;
  while (existingFiles.includes(`${outputBase}-${i}`)) i++;

  const outputDir = `${dir}/${outputBase}-${i}`;
  await fs.mkdir(outputDir);

  return outputDir;
};
