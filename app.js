const express = require('express');
const bodyParser = require('body-parser');
const mongoRef = require('./mongo');
const mongooseRef = require('./mongoose');
const app = express();

app.use(bodyParser.json());

// app.post('/products', mongoRef.createProduct);
app.post('/products', mongooseRef.createProduct);

app.get('/products', mongoRef.getProducts);

app.listen(3000);