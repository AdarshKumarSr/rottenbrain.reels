require('dotenv').config();
const axios = require('axios');
const path = require('path');
const downloadVideo = require('../utils/downloadVideo');

const API_KEY = process.env.YT_API_KEY;
const SEARCH_QUERY = 'subway surfer #shorts';
const MAX_RESULTS = 250;

function parseDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || '0');
  const seconds = parseInt(match?.[2] || '0');
  return minutes * 60 + seconds;
}

async function searchShorts(searchQuery = SEARCH_QUERY) {
  const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
  const searchParams = {
    part: 'snippet',
    q: SEARCH_QUERY,
    type: 'video',
    videoDuration: 'short',
    videoLicense: 'creativeCommon',
    maxResults: MAX_RESULTS,
    key: API_KEY,
  };

  const searchRes = await axios.get(searchUrl, { params: searchParams });
  const items = searchRes.data.items || [];
  const videoIds = items.map(item => item.id.videoId).join(',');

  const detailsUrl = 'https://www.googleapis.com/youtube/v3/videos';
  const detailsParams = {
    part: 'snippet,contentDetails',
    id: videoIds,
    key: API_KEY,
  };

  const detailsRes = await axios.get(detailsUrl, { params: detailsParams });
  const videos = detailsRes.data.items || [];

  const shorts = videos.filter(video => {
    const duration = parseDuration(video.contentDetails.duration);
    const title = video.snippet.title.toLowerCase();
    const desc = video.snippet.description.toLowerCase();
    return (
      duration >= 30 &&
      duration <= 60 &&
      (title.includes('#shorts') || desc.includes('#shorts'))
    );
  });

  return shorts.slice(0, 3).map(v => ({
    id: v.id,
    url: `https://www.youtube.com/watch?v=${v.id}`,
  }));
}

function sanitizeFilename(str) {
  return str.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
}

async function downloadVideos(videoList) {
  for (const { id, url } of videoList) {
    try {
      console.log(`🔽 Downloading ${url}`);

      const filename = `${id}.mp4`;
      const outputPath = path.join(__dirname, '..', 'downloaded_vedios', filename);

      await downloadVideo(url, outputPath);
      console.log(`✅ Downloaded: ${filename}`);
    } catch (err) {
      console.error(`❌ Failed to download ${url}:`, err.message);
    }
  }
}

async function getVideos(searchQuery = '') {
  const shorts = await searchShorts(searchQuery);
  const urls = shorts.map(v => v.url);
  console.log('🎯 Found Shorts (50–60s):', urls);
  await downloadVideos(shorts);
}

module.exports = getVideos;