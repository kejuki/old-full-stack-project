const express = require('express');
const router = express.Router();
const Col = require('../models/Col');

//get all
router.get('/', async (req, res) => {
    try {
        const cols = await Col.find();
        res.json({cols});
    } catch (err) {
        res.json({ message: err });
    }
});

//get spesific
router.get('/:colId', async (req, res) => {
    try {
        const col = await Col.findById(req.params.colId);
        res.json(col);
    } catch (error) {
        res.json({message: err});
    }
});

//submits a col
router.post('/', async (req,res) => {
    const col = new Col({
        title: req.body.title,
        content: req.body.content
    });
    try{
    const savedCol = await col.save();
    res.json(savedCol);
    }catch(err){
        res.json({message: err});
    }
});

//deletes a col
router.delete('/:colId', async (req, res) => {
    try {
        const removedCol = await Col.deleteOne({_id: req.params.colId});
        res.json(removedCol);
    } catch (err) {
        res.json({message: err});
    }
});

//update a col
router.patch('/a/:colId', async (req, res) => {
    try {
        const updatedCol = await Col.updateOne(
            { _id: req.params.colId }, 
            { $set: { 
                title: req.body.title
            }});
        res.json(updatedCol);
    } catch (error) {
        console.log(error);
    }
});
router.patch('/:colId-:subId', async (req, res) => {
    console.log(req.param.colId);
    try {
        const updatedCol = await Col.updateOne(
            { _id: req.params.colId }, 
            { $pullAll: { 
                _id: [req.param.subId]
            }});
        res.json(updatedCol);
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;