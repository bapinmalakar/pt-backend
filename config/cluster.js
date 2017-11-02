'use strict'
const cluster = require('cluster');
const workers = require('os').cpus().length;
const port = process.env.PORT || 8100;

module.exports = (app) => {
    if (cluster.isMaster) {
        console.log('Number of Workers' + maxWorkers);
        for (let i = 0; i < workers; i++)
            cluster.fork();
        cluster.on('online', (worker) => console.log('The Worker' + worker.process.pid + ' is online'));

        cluster.on('exit', (worker, code, signal) => {
            console.log('Worker ' + worker.process.pid + ' Is0 Exist With Code: ' + code + ', and Signal Is: ' + signal);
            console.log('Start a New Worker');
            cluster.fork();
        });
    }
    else {
        const server = app.listen(PORT, () => {
            console.log(`Process ${process.pid} is listening to all incoming requests on port ${PORT}`);
        })
        app.all('/*', (req, res) => {
            res.send('process ' + process.pid + ' says hello!').end();
        })
    }
}