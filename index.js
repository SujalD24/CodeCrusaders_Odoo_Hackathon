const express = require('express');
const app = express();
const path = require('path');


//ejs 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/checkConnection', (req, res) => {
    res.send("WORKING!!")
})

app.listen('8080', (req, res) => {
    console.log("app listening on 8080");
})