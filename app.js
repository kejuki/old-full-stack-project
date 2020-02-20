const   express = require('express'),
        mongoose = require('mongoose'),
        cors = require('cors'),
        app = express(),
        url = 'mongodb://127.0.0.1:27017/tod',
        port = 3000;

//import routes
const colRoute = require('./routes/cols');

//connect to db
mongoose.connect(url,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    () => {
        console.log("connected to db");
    }
);



//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/cols', colRoute);
app.use('/site', express.static('site'));



app.listen(port);