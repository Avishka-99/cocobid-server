const cron = require('node-cron')
const { Model } = require('sequelize')
const shelljs = require('shelljs')

function cronJob() {
    console.log("cron is running")
}

cron.schedule("* * * * * *", cronJob())
module.exports = cronJob;