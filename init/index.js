const mongoose = require("mongoose");
const initData = require("./data.js");
const Listening = require("../models/listing.js");
const MONGO_KEY = "mongodb+srv://nikhil11211:nikhil11211@airbnb.8dawlje.mongodb.net/";


main().then((res)=>{
    console.log("Connected to DataBase");
}).catch(err => console.log(err));

async function main(){
    mongoose.connect(MONGO_KEY);
}

const initDB = async () =>{
    await Listening.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner :'6601d25a8fae684da8f77512'})) 
    await Listening.insertMany(initData.data);
    console.log("Data Was Initialized");
}
initDB();