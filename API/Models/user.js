const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email : {type: String,
            required: true,
            match: /[a-zA-Z\_\-\.\d]{1,}[@][a-zA-Z\_\-\d]{1,}[\.][a-z]{2,4}$/},
    password: {type: String, required: true},
});

module.exports = mongoose.model('User', userSchema);