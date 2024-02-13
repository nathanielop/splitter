import { Command } from 'commander';

import splitVideo from './functions/split-video.js';
import validatePath from './functions/validate-path.js';
import validateTime from './functions/validate-time.js';

const program = new Command();

program
  .name('video-splitter')
  .description('A lightweight CLI to split videos into predefined intervals')
  .version('0.0.1');

program
  .command('split')
  .description('Split a video into predefined lengths')
  .argument('<video file path>', 'path to the video file', validatePath)
  .argument('<output path>', 'path to save the split videos', validatePath)
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
  .action(splitVideo);

await program.parseAsync();
