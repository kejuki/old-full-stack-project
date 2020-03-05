const express = require('express');
const router = express.Router();
const multer = require('multer');
const ListItem = require('../models/ListItem');
const path = require('path');

//storage engine

const storage = multer.diskStorage({
    destination: './site/img',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

//get all

router.get('/', async (req, res) => {
    try {
        const items = await ListItem.find();
        res.json({items});
    } catch (err) {
        res.json({ message: err });
    }
});

//get spesific

router.get('/:itemId', async (req, res) => {
    try {
        const items = await ListItem.findById(req.params.itemId);
        res.json(items);
    } catch (error) {
        res.json({message: err});
    }
});

//submits a col

router.post('/', async (req,res) => {
    const listItem = new ListItem({
        title: req.body.title,
        imgurl: req.body.imgurl,
        texts: req.body.texts
    });
    try{
        const savedListItem = await listItem.save();
        res.json(savedListItem);
    }catch(err){ 
        res.json({message: err});
    }
});

//deletes a col
router.delete('/:itemId', async (req, res) => {
    try {
        const removedListItem = await ListItem.deleteOne({_id: req.params.itemId});
        res.json(removedListItem);
    } catch (err) {
        res.json({message: err});
    }
});

//update a col

router.patch('/texts/:itemId', async (req, res) => {
    try {
        const updatedListItem = await ListItem.updateOne(
            { _id: req.params.itemId }, 
            { $set: { 
                texts: req.body.texts
            }});
        res.json(updatedListItem);
    } catch (error) {
        console.log(error);
    }
});

router.patch('/title/:itemId', async (req, res) => {
    try {
        const updatedListItem = await ListItem.updateOne(
            { _id: req.params.itemId }, 
            { $set: { 
                title: req.body.title
            }});
        res.json(updatedListItem);
    } catch (error) {
        console.log(error);
    }
});

//upload img

router.post('/upload/:itemId', upload.single("img"), async (req,res) => {
    try {
        const updatedListItem = await ListItem.updateOne(
            { _id: req.params.itemId }, 
            { $set: { 
                imgurl: req.file.path
            }});
        res.json(updatedListItem);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;