# scheduler

To run immediately comment out the following two lines in services/schedular.js file
    // schedule.scheduleJob('0 10 * * *', fetchAndProcessCSV); // Runs 10 AM
    // schedule.scheduleJob('0 17 * * *', fetchAndProcessCSV); // Runs 5 PM

and insert 
setImmediate(fetchAndProcessCSV) instead