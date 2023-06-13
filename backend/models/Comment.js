const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
        body: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        authorId: {
            type: Schema.Types.ObjectId,
            required: true
        },
    }, {
        timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
