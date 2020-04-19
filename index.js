const express = require('express');
const app = express();
const port = 8000;

//middleware to access route folder
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is runngin on port: ${port}`);
})