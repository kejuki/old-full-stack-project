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

router.get('/:texId', async (req, res) => {
    try {
        const tex = await Tex.findById(req.params.texId);
        res.json(tex);
    } catch (error) {
        res.json({message: err});
    }
});

router.post('/', async (req,res) => {
    const tex = new Tex({
        column: req.body.col,
        title: req.body.title,
        text: req.body.text,
        done: req.body.done,
        hidden: req.body.hidden
    });
    try{
    const savedTex = await tex.save();
    res.json(savedTex);
    }catch(err){
        res.json({message: err});
    }
});

router.delete('/:texId', async (req, res) => {
    try {
        const removedTex = await Tex.deleteOne({_id: req.params.texId});
        res.json(removedTex);
    } catch (err) {
        res.json({message: err});
    }
});

router.patch('/:texId', async (req, res) => {
    try {
        const updatedTex = await Tex.updateOne(
            { _id: req.params.texId }, 
            { $set: { 
                title: req.body.title,
                text: req.body.text,
                done: req.body.done,
                hidden: req.body.hidden
            }});
        res.json(updatedTex);
    } catch (error) {
        res.json({message: err});
    }
});

module.exports = router;