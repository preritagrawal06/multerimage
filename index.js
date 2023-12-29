const express = require('express');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
const app = express()
const uploadRoute = require('./routes/uploadRoute')

app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  
  app.use(express.json({ extended: true }));
  app.use(express.urlencoded({ extended: true }));

const url = process.env.MONGO_URI

app.use('/', uploadRoute)

mongoose.connect(url)
  .then(()=>{
    app.listen(3000, ()=>{
        console.log('connected to db')
    })
  })
  .catch(err => {
    console.log(err)
  })