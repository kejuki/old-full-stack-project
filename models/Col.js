const mongoose = require('mongoose');

const ColSchema = mongoose.Schema({
    title: String,
    imgurl: String,
    texts: String
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);