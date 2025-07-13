const { exec } = require('child_process');
const path = require('path');

function downloadVideo(videoUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `python -m yt_dlp -f mp4 -o "${outputPath}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr.trim()));
      }
      resolve(stdout.trim());
    });
  });
}

module.exports = downloadVideo;
