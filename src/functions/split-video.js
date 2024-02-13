import { createWriteStream } from 'node:fs';

import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';

import fail from '../functions/fail.js';
import getDurationSeconds from '../functions/get-duration-seconds.js';
import getValidOutputDir from '../functions/get-valid-output-dir.js';

const { console, Promise } = globalThis;

export default async (path, output, options) => {
  let { end, start, interval } = options;

  if (end) end = getDurationSeconds(end);
  if (start) start = getDurationSeconds(start);

  ffmpeg.setFfprobePath(ffprobe.path);
  ffmpeg.setFfmpegPath(ffmpegPath.path);

  const metaData = await new Promise(resolve =>
    ffmpeg.ffprobe(path, (err, data) => resolve(data))
  );
  const duration = metaData.format.duration;

  // Validate end and start time are within clip duration
  if (end || start) {
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
  const endSeconds = end ?? duration;
  const intervalSeconds = getDurationSeconds(interval);
  const format = metaData.format.format_name.split(',')[0];

  let from = start ?? 0;
  let i = 0;
  while (from < endSeconds) {
    const to = Math.min(from + intervalSeconds, endSeconds);

    ffmpeg(path)
      .setStartTime(from)
      .setDuration(to - from)
      .format(format)
      .on('error', err => console.error(err))
      .on('end', () => console.log(`Trimmed clip ${i}`))
      .pipe(createWriteStream(`${outputDir}/${i}.${format}`));

    from = to;
    i++;
  }
};
