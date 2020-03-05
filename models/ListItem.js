const mongoose = require('mongoose');

const listItemSchema = mongoose.Schema({
    title: String,
    imgurl: String,
    texts: String
}, {versionKey: false
});


module.exports = mongoose.model('ListItems', listItemSchema);

