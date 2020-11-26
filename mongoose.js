const mongoose = require('mongoose');
const Product = require('./models/products');

const URI = 'mongodb+srv://gaurav:Yomg6G4AThmo7FGs@cluster0.kaejb.mongodb.net/products_test?retryWrites=true&w=majority';

mongoose.connect(URI, { useNewUrlParser: true , useUnifiedTopology: true}).then(() => {
    console.log('connected to databse');
}).catch(() => {
    console.log('connection failed');
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

exports.createProduct = createProduct;
exports.getProducts = getProducts;
