const cron = require('node-cron');
const {downloadLatest} = require('./disposableService');

function startScheduler(){
    cron.schedule(
        "0 0 * * *",
        async ()=>{
            console.log("Updating Disposable Emails...");
            await downloadLatest();
        },
        {
            timezone: "Asia/Kolkata"
        }
    );
}

module.exports = {startScheduler} ;