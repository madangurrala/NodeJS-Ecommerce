const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    commentDesc: {type: String},
    rating: {type: Number},
    image: {type: String},
});

module.exports = mongoose.model('Comment', commentSchema);