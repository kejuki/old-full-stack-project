const   express = require('express'),
        mongoose = require('mongoose'),
        cors = require('cors'),
        multer = require('multer'),
        path = require('path'),
        app = express(),
        url = 'mongodb://127.0.0.1:27017/tod',
        port = 3000;

//import routes
const colRoute = require('./routes/cols');

//storage engine
const storage = multer.diskStorage({
    destination: './site/img',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('myImage');



//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/cols', colRoute);
app.use('/saitti', express.static('site'));

app.post('/upload', (req,res) => {
    console.log("test");
    upload(req, res, (err) => {
        if(err) { console.log(err)}
        else{
            res.redirect('/saitti')
            console.log(req.file.filename);
        }
    });
});

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