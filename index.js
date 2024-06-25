const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const { scheduleJobs } = require('./services/scheduler');
const { logger } = require('./helpers/logger');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
const URL = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.tu2rdhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.info('Connected to MongoDB');
}).catch(err => {
    logger.error('Error connecting to MongoDB:', err);
});

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    scheduleJobs();
});
