const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose')

//accesing form data with this middleware
app.use(express.urlencoded());


//assign cookie parser
app.use(cookieParser());

//accessing staitic files and layouts
app.use(express.static('./assets'));
app.use(expressLayouts);


//extract styles and sctipts from the sub-folder into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//middleware to access route folder
app.use('/', require('./routes'));

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err) {
    if (err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
})