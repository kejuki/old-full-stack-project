const mongoose = require('mongoose');

const TextfieldSchema = mongoose.Schema({
    id: Number,
    column: Number,
    title: String,
    text: String,
    done: Boolean,
    hidden: Boolean
}, {versionKey: false
});


module.exports = mongoose.model('Textfields', TextfieldSchema);