const express = require('express');
const bodyParser = require('body-parser');
const mongoRef = require('./mongo');
const mongooseRef = require('./mongoose');
const cors = require('cors');
const app = express();
const multer  = require('multer');
const { mongo } = require('mongoose');
// app.use(bodyParser.json());
app.use(express.json())
app.use(cors());

// create a folder called uploads
//define storage for where file is to be uploaded
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + file.mimetype.replace('image/','.'))
    }
});
 
// using multer to upload file
var upload = multer({ storage: storage });



app.post('/products', mongooseRef.createProduct);

app.get('/products', mongoRef.getProducts);

// routes related to user

app.post('/register', mongooseRef.registerUser);
app.post('/login',mongooseRef.login)
app.get('/loadimage/:username', mongooseRef.loadImage)

// passing the upload single method, with image being the name which the name of form data field from the client
app.post('/upload/:username', upload.single('image'), mongooseRef.uploadProfileImage);
app.delete('/image/:username',mongooseRef.deleteImage);
app.listen(3000);