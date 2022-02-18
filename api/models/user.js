const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    localId: { type: String, required: true },
    idToken: { type: String, required: false },
    displayName: { type: String, required: false },
    profileImage: { type: String, required: false },
    briefInfo: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    homeAddress: { type: String, required: false },
    age: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);