const mongoose = require('mongoose');

const ColSchema = mongoose.Schema({
    id: Number,
    title: String
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);