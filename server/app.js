const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const url = 'mongodb://127.0.0.1:27017/tod';
const port = 3000;

//import routes
const colRoute = require('./routes/cols');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/cols', colRoute);

//connect to db
mongoose.connect(url,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    () => {
        console.log("connected to db");
    }
);


app.listen(port);