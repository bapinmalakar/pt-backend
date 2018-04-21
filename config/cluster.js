
'use strict'
const cluster = require('cluster');
const workers = require('os').cpus().length;
const port = process.env.PORT || 80;

module.exports = (app) => {
   const server = app.listen(PORT, () => {
        console.log(`Process ${process.pid} is listening to all incoming requests on port ${PORT}`);
   });
   app.all('/*', (req, res) => {
            res.send('process ' + process.pid + ' says hello!').end();
   });
}
