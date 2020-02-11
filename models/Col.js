const mongoose = require('mongoose');

const ColSchema = mongoose.Schema({
    title: String,
    images: Array,
    texts: Array
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);