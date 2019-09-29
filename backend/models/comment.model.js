const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true },
    upvotes: { type: Number, default: 0},
    downvotes: { type: Number, default: 0},
        
},{
    timestamps : true,
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;