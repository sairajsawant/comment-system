const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expressWs = require('express-ws');

require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

const corsOptions = {
    exposedHeaders: 'auth-header',
};
app.use(cors(corsOptions));

app.use(express.json());
const wsInstance = expressWs(app);

const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connected');
});
 
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');
const cacheRouter = require('./routes/cache');

app.use('/api/users',authRouter);
app.use('/api/comments',commentsRouter);
app.use('/api/cache', cacheRouter);

app.ws('/comment', (ws, req) => {

    ws.on('message', function incoming(message) {
      console.log(message) ;
      ws.broadcast(message);
    });

    ws.broadcast = function broadcast(data) {
      wsInstance.getWss().clients.forEach(function each(client) {
      client.send(data);
      });
    };
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
