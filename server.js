const express = require('express')
const cors = require('cors')
const db = require("./app/models")
const multer = require("multer")
const path = require("path")

const app = express();
const port = process.env.PORT || 8181;

// logic upload file

const storageUpload = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "./app/uploads")
    },
    filename: function (req, file, cb) {
        // console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({storage: storageUpload}).fields([
    {name : 'bukti_tf', maxCount: 1},
])

//app use
const corsOptions = {
    origin : "*"
};
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,  Authorization, Content-Type, Accept");
    next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(upload);
app.use('/app', express.static('app'));
// app.use(express.static('app'))


//db connect

const connectDatabase = async () => {
    
    await db.mongoose.connect(db.url, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }).then(() => console.log('connected to database')
    ).catch(e => {
        console.log(`failed to connect db : ${e.message}`);
        process.exit()
    });
};


connectDatabase();

// routes
require("./app/routes/ticket.routes")(app);


app.get('/', (req, res) => res.send('Ready for ticketing'))
app.listen(port, () => console.log(`Testing port ${port}!`))