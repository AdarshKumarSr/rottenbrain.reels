const express = require('express');
const connectDB = require('./dbConfig/dbConfig');
const generateContentRouter = require('./routes/generateContentRoute');
const app = express();

require('dotenv').config();
connectDB();

app.use(express.json());

// your routes go here
app.use('/api', generateContentRouter);
app.use('/api', require('./routes/getVideosRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
