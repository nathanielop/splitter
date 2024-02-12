import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';

import { Command, InvalidArgumentError } from 'commander';
import ffmpeg from 'fluent-ffmpeg';

const { __dirname, console, process } = globalThis;

const program = new Command();

const outputBase = 'split';

// [[hh:]mm:]ss[.xxx] format
const timeRegexp = /((\d{2}:)?\d{2}:)?\d{2}(\.\d{3})?/;

const validateTime = ts => {
  if (ts && !timeRegexp.test(ts)) {
    throw new InvalidArgumentError(
      `Invalid time format. Please use [[hh:]mm:]ss[.xxx] format. Provided value: ${ts}`
    );
  }
  return ts;
};

const validatePath = path => {
  if (!existsSync(path)) {
    throw new InvalidArgumentError(`Invalid file path: ${path}`);
  }
  return path;
};

const getValidOutputDir = async dir => {
  const existingFiles = await fs.readdir(dir);

  let i = 0;
  while (existingFiles.includes(`${outputBase}-${i}`)) i++;

  const outputDir = `${dir}/${outputBase}-${i}`;
  await fs.mkdir(outputDir);

  return outputDir;
};

const fail = msg => {
  console.error(msg);
  process.exit(1);
};

program
  .name('video-splitter')
  .description('A lightweight CLI to split videos into predefined intervals')
  .version('0.0.1');

program
  .command('split')
  .description('Split a video into predefined lengths')
  .argument('<video file path>', 'path to the video file', validatePath)
  .argument(
    '<output path>',
    'path to save the split videos',
    validatePath,
    __dirname
  )
  .option(
    '-i, --interval <duration>',
    'the duration of each split video',
    '5:00',
    validateTime
  )
  .option(
    '-s, --start <start time>',
    'the time of the video to start splitting from',
    validateTime
  )
  .option(
    '-e, --end <end time>',
    'the time of the video to end splitting at',
    validateTime
  )
  .action(async (path, output, options) => {
    const { end, start, interval } = options;

    // Validate end and start time are within clip duration
    if (end || start) {
      const metaData = await ffmpeg.ffprobe(path);
      const duration = metaData.format.duration;
      if (start && start > duration) {
        fail(
          `Provided start time, is longer than video duration, value: ${start}, duration: ${duration}`
        );
      } else if (end && end > duration) {
        fail(
          `Provided end time is longer than video duration, value: ${end}, duration: ${duration}`
        );
      }
    }

    const outputDir = await getValidOutputDir(output);
    const stream = await fs.createWriteStream(outputDir);

    const video = ffmpeg(path, '');
    // todo
  });

await program.parseAsync();
