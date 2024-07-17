const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.get("/",(req,res)=>{
    console.log("Here");
    res.send("Hi")
})
app.listen(3000);