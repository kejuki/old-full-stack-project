const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017';
const app = express();
const port = 3000;

//middleware

/*
app.use('/a', () => {
    console.log("this is a middleware running");
});
*/

//routes
app.get('/', (req, res) => res.send('home'));

app.get('/a', (req, res) => {
    res.send("a");
});

//connect to db
mongoose.connect(url,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    () => {
        console.log("asd");
    }
);


app.listen(port);