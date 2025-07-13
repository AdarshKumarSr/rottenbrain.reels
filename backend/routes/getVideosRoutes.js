const express = require('express');
const router = express.Router();
const getVideos = require('../controllers/fetchVediosController');

// Route to fetch and download videos
router.get('/getVideos', async (req, res) => {
    try {
        const searchQuery = req.query.search || 'subway surfer #shorts';
        await getVideos(searchQuery);
        res.status(200).json({ message: 'Videos fetched and downloaded successfully.' });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos.' });
    }
});

module.exports = router;