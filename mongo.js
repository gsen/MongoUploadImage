const MongoClient = require('mongodb').MongoClient;
const URI = 'mongodb+srv://gaurav:Yomg6G4AThmo7FGs@cluster0.kaejb.mongodb.net/products_test?retryWrites=true&w=majority';

const createProduct = async (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }

    const client = new MongoClient(URI);
    try {

        await client.connect();
        const db = client.db();
        const result = await db.collection('products').insertOne(newProduct);
        console.log(result);
    } catch (ex) {
        res.json({ message: `couldn't store data` });
    } finally {
        client.close();
    }
    res.json(newProduct);

}
const getProducts = async (req, res, next) => {
    const client = new MongoClient(URI);
    let products;
    try {

        await client.connect();
        const db = client.db();
        products = await db.collection('products').find().toArray();
    } catch (ex) {
        res.json({ message: `couldn't get products` });
    } finally {
        client.close();
    }
    res.json(products);
}

exports.createProduct = createProduct;
exports.getProducts = getProducts;