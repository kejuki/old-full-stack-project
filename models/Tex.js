const mongoose = require('mongoose');

const TextfieldSchema = mongoose.Schema({
    column: String,
    title: String,
    text: String,
    done: Boolean,
    hidden: Boolean
}, {versionKey: false
});


module.exports = mongoose.model('Textfields', TextfieldSchema);