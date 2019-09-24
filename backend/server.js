const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connected');
});
 
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');
//const usersRouter = require('./routes/users');

// app.use('/users',usersRouter);
app.use('/api/user-management',authRouter);
app.use('/api/comment-management',commentsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
