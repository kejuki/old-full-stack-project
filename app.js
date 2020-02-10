const   express = require('express'),
        mongoose = require('mongoose'),
        cors = require('cors'),
        app = express(),
        url = 'mongodb://127.0.0.1:27017/tod',
        port = 3000;

//import routes
const   colRoute = require('./routes/cols'),
        texRoute = require('./routes/texs');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/cols', colRoute);
app.use('/texs', texRoute);
app.use('/saitti', express.static('site'));

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