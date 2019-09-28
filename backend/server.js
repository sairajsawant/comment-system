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
//const usersRouter = require('./routes/users');

// app.use('/users',usersRouter);
app.use('/api/users',authRouter);
app.use('/api/comments',commentsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
