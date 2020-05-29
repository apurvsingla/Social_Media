const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: "development",
    asset_path: '/assets',
    session_cookie_key: "blahsomething",
    db: 'social-development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: 'socialplatform123',
            pass: 'Social@123'
        }
    },
    google_client_id: "927644119646-l3rbknvunjosnbtfr30c2afi4go80jvd.apps.googleusercontent.com",
    google_client_secret: "N4bfbfVbUgJsyRIvBoq3rnrp",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'yeahwhy1523dfs',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: "production",
    asset_path: process.env.SOCIAL_ASSET_PATH,
    session_cookie_key: process.env.SOCIAL_SESSION_COOKIE_KEY,
    db: process.env.SOCIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: process.env.SOCIAL_GMAIL_USERNAME,
            pass: process.env.SOCIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.SOCIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }
}

module.exports = eval(process.env.SOCIAL_ENVIORNMENT) == undefined ? development : eval(process.env.SOCIAL_ENVIORNMENT);