const mongoose = require('mongoose');
const Product = require('./models/products');
const Image = require('./models/image');
const User = require('./models/user');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
// console.log('uri', process.env.URI);

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to databse');
}).catch((err) => {
    console.log('connection failed', err);
});

createProduct = async (req, res, next) => {
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    const result = await createdProduct.save();

    res.json(result);
}
getProducts = async (req, res, next) => {
    const result = await Product.find().exec();
    res.json(result);
}

// section related to user

uploadImage = async (req, res, next) => {
    // console.log('data is',req.body);
    console.log('logging file', req.file);
    let file = req.file;
    let existingImage = await Image.findOne({ 'name': req.file.filename }).exec();
    if (existingImage && !existingImage.isNew) {
        console.log('existing image found',existingImage);
        existingImage.data = fs.readFileSync(file.path);
        existingImage.name = file.filename;
        existingImage.contentType = file.mimetype;
        let result = await existingImage.save();
        console.log('existing image modified', result);
        if (result) {
            res.json(true);
        }
    } else {
        console.log('new image')
        let image = new Image({
            data: fs.readFileSync(__dirname + '/' +file.path),
            name: file.filename,
            contentType: file.mimetype
        });
        try {
            let result = await image.save();
            console.log(result);
            res.json(true);
        } catch (ex) {
            console.log(ex)
        }
    }
    // let data = Buffer.from(req.body.data,'base64');
}

loadImage = async (req, res, next)=>{

    let user = await User.findOne({ 'username': req.params.username }).exec();
    if(user){
        res.json({data: user.image.data.toString('base64'), contentType: user.image.contentType})
    }
   
}

login = async (req, res)=>{
    console.log('inside login', req.body)
    const {username, password} = req.body;
    const user = await User.findOne({'username': username, 'password': password}).exec();
    if(user?.email){
        // delete user.password;
        // if(user.image?.data){
        //     user.image.data = user.image.data.toString('base64');
        // }
        res.json({username: user.username, email:user.email, image:{
            data: user.image.data.toString('base64'),
            contentType: user.image.contentType
        }});
    }else{
        res.status(404).send('invalid username or password');
    }
}

deleteImage = async(req, res)=>{
    const {username} = req.params;
    let foundUser = await User.findOne({'username': username}).exec();
    if(foundUser){
        foundUser.image = null;
        await foundUser.save();
        res.json(true);
    }
}

uploadProfileImage =  async (req, res, next) => {
    // console.log('data is',req.body);
    console.log('logging file', req.file);
    console.log(req.params)
    let file = req.file;
    let user = await User.findOne({ 'username': req.params.username }).exec();

    if(user){
        user.image = {
            name:file.filename,
            data:fs.readFileSync(__dirname + '/' +file.path),
            contentType:file.mimetype
        }
        let result = await user.save();
        console.log(result);
        res.json(true);
    }
}

registerUser = async(req, res)=>{
    const {username, password, email} = req.body;
    const newUser = new User({
        username, password, email
    });
    const userCreated = await newUser.save();
    res.json(userCreated);
}
exports.login = login;
exports.deleteImage = deleteImage;
exports.registerUser = registerUser
exports.uploadProfileImage = uploadProfileImage;
exports.uploadImage = uploadImage;
exports.loadImage = loadImage;
exports.createProduct = createProduct;
exports.getProducts = getProducts;
