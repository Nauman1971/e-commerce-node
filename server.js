const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readdirSync } = require("fs");
require('dotenv').config();

//port
const port = process.env.PORT || 8000;

// app
const app = express();


// db
if (process.env.NODE_ENV === "production") {

    const path = require("path");
    app.use(express.static(path.resolve(__dirname, ("client/build"))));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

    mongoose.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
        .then(() => console.log("DB CONNECTED"))
        .catch(err => console.log(`DB CONNECTION ERR ${err}`))

} else {
    const path = require("path");
    app.use(express.static(path.resolve(__dirname, ("client/build"))));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
        .then(() => console.log("DB CONNECTED"))
        .catch(err => console.log(`DB CONNECTION ERR ${err}`))
}

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// routes
readdirSync('./routes')
    .map((r) => app.use("/api", require("./routes/" + r)))
app.listen(port, () => console.log(`Server is running on port ${port}`));

