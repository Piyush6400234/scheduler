const schedule = require('node-schedule');
const axios = require('axios');
const csv = require('csv-parser');

const Case = require('../models/Case');
const { logger } = require('../helpers/logger');
const {getStandardisedData} = require('./utils');
const stream = require('stream');
const util = require('util');
const finished = util.promisify(stream.finished);

require('dotenv').config();





async function insertBatch(batch) {
    try {
        await Case.insertMany(batch);
    } catch (err) {
        throw new Error('Error inserting batch into MongoDB: ' + err.message);
    }
}


async function fetchAndProcessCSV() {
    try {
        const response = await axios({
            method: 'get',
            url: process.env.DOCLINK,
            responseType: 'stream',
        });

        const csvStream = response.data.pipe(csv());
        let batch = [];
        let chunkCount = 0;

        csvStream.on('data', async (data) => {

            // Standardize and transform data according to given schema
            const standardizedData = getStandardisedData(data);
        

            batch.push(standardizedData);

 
 
            // If batch size is reached, insert batch into MongoDB and reset batch 
            if (batch.length >= process.env.BATCH_SIZE) {
                csvStream.pause(); // Pause the stream to wait for the batch insertion to complete
                try {
                    await insertBatch(batch);
                    logger.info(`Batch inserted successfully, chunk ${chunkCount}`);
                    batch = []; // Reset batch
                    chunkCount++;
                    csvStream.resume(); // Resume the stream
                } catch (err) {
                    logger.error('Error inserting batch into MongoDB:', err);
                    csvStream.resume(); // Resume the stream even on error to continue processing
                }
                
            }
        });
 
        csvStream.on('end', async () => {
           
            // Insert any remaining records in the last batch
            if (batch.length < process.env.BATCH_SIZE) {
                try {
                    await insertBatch(batch);
                    logger.info('Final batch inserted successfully');
                } catch (err) {
                    logger.error('Error inserting final batch into MongoDB:', err);
                }
            }
            logger.info('CSV data processing completed');
        });

        await finished(csvStream);
    } catch (error) {
        logger.error('Error fetching or processing CSV:', error);
    }
}

function scheduleJobs() {
    schedule.scheduleJob('0 10 * * *', fetchAndProcessCSV); // Runs 10 AM
    schedule.scheduleJob('0 17 * * *', fetchAndProcessCSV); // Runs 5 PM
    // setImmediate(fetchAndProcessCSV); // for testing immediately

}

module.exports = { scheduleJobs };
