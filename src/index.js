require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    app.use(cors());
    next();
});

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000);