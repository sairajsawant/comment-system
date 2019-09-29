const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

const corsOptions = {
    exposedHeaders: 'auth-header',
};
app.use(cors(corsOptions));

app.use(express.json());

const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connected');
});
 
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');

app.use('/api/users',authRouter);
app.use('/api/comments',commentsRouter);

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(message) ;
    //ws.emit(message);
    wss.broadcast(message);
  });
  
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
