const mongoose = require('mongoose');

const SubSchema = mongoose.Schema({
    type: String,
    imgurl: String,
    texts: String,
    order: Number
}, {versionKey:false
});

const ColSchema = mongoose.Schema({
    title: String,
    content: [SubSchema]
}, {versionKey: false
});


module.exports = mongoose.model('Cols', ColSchema);