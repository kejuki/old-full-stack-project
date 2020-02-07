const express = require('express');
const router = express.Router();
const Tex = require('../models/Tex');

//get all
router.get('/', async (req, res) => {
    try {
        const texs = await Tex.find();
        res.json({texs});
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;