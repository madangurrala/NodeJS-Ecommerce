const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    productName: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    quantity: {type: Number, required: true}
});

module.exports = mongoose.model('Cart', cartSchema);