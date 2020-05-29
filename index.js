const express = require('express');

//for deployment
const env = require('./config/enviornment');
const logger = require('morgan');


const app = express();
require('./config/view-helper')(app);
const cookieParser = require('cookie-parser');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth-strategy');



const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
// file upload
const multer = require('multer');

//chat server and it should be unique
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

// for deployment
const path = require('path');
if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}
//for deployment
app.use(express.static(env.asset_path));
//accesing form data with this middleware
app.use(express.urlencoded({ extended: true }));


//assign cookie parser
app.use(cookieParser());

//accessing staitic files and layouts
app.use(express.static('./assets'));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options))

app.use(expressLayouts);


//extract styles and sctipts from the sub-folder into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Social',
    // Todo change the secret before deployment in production node
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }),
    function(err) {
        console.log(err || 'connect-mongodb setup ok');
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


//middleware to access route folder
app.use('/', require('./routes'));


app.listen(port, function(err) {
    if (err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
})