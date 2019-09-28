
//Importing server from NodeJs
const http = require('http');

//importing app file. 
const app = require('./app');

//Assigning a port where project should run.
//We can get through an env variable or hardcode it
const port = process.env.PORT || 3000;

//passing app to create server
const server = http.createServer(app);

server.listen(port);