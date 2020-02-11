const mongoose = require('mongoose');

const ColSchema = mongoose.Schema({
    title: String,
    images: { imgurl: String },
    texts: { text: String }
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);