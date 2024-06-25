const express = require('express');
const mongoose = require('mongoose');
const Case = require('../models/Case');
const { logger } = require('../helpers/logger');
const router = express.Router();


// Aggregated data endpoint
router.get('/cases/aggregate', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        // const r = JSON.stringify(req);
        logger.info(`request recieved from ${req.hostname} at endpoint /api/cases/aggregate with query Parameters {startDate: ${startDate}, endDate: ${endDate}}\n`)
        const filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const result = await Case.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$city',
                    totalCases: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
        logger.info(`request from ${req.hostname} at endpoint /api/cases/aggregate was succesful`);
    } catch (error) {
        logger.info(`request recieved from ${req.hostname} at endpoint /api/cases/aggregate failed with status code 500`)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
