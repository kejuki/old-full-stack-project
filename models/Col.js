const mongoose = require('mongoose');

const ColSchema = mongoose.Schema({
    title: String
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);