const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parse");

dotenv.config();

// set up server
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server started on port: ${PORT}` ));


app.use(express.json());
app.use(cookieParser());

// connect to mongoDB
mongoose.connect(process.env.MDB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) =>{
    if(err) return console.log(err);
    console.log("connect to MongoDB")
});

// set up routes


app.use("/auth", require("./routers/userRouter"));
app.use("/customer", require("./routers/customerRouter"));