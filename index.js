require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
let api_routes = require('./GET/GetRoutes.js');



let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Middleware - enable CORS
app.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*"); //root site in IIS already enables this (will crash if 2)
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});


// Middleware - Serve static files from the specified directory (Not used in production with IIS as web.config takes care of it).
app.use(express.static(__dirname + '/src')); //could also change to '/build' for staging tests

app.use("/", api_routes);

// Start Node Server
app.listen(process.env.PORT || 8000);