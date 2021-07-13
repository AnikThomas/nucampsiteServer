//Task 1: Add Mongoose Schema and Model for favorites collection
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
}, {
    timestamps: true
});

//create model, Favorite, for data.
const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;