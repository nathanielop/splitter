# Video Splitter

A lightweight node CLI to split a video into predefined lengths. Useful for splitting long form videos into bite sized pieces to be sent via iMessage, WhatsApp, etc.

## Usage
`splitter split my_movie.mp4 output`

## Arguments
1. Path to video file source
2. Path to output to

## Options
* --interval (alias -i, optional, default: 05:00 / 5 minutes)
    Duration definition for each clip length, excluding final clip which will be remaining amount of the clip
* --start (alias -s, optional)
    Timestamp of clip to start clipping from
* --end (alias -e, optional)
    Timestamp of clip to end clipping at