const mongoose = require('mongoose');

const ColSchema = mongoose.Schema({
    title: String,
    content: Array
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);