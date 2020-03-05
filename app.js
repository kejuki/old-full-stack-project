
const   express = require('express'),
        mongoose = require('mongoose'),
        app = express(),
        url = 'mongodb://127.0.0.1:27017/tod',
        port = 3000;

//import routes
const listItemRoute = require('./routes/listItems');

//connect to db

mongoose.connect(url,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
);

//middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/listItems', listItemRoute);
app.use('/site', express.static('site'));


app.listen(port);