const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Product = require('../models/Product');


const router = require('express').Router();


//create
router.post('/create', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body)
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
})

//update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        //$set : reemplaza los valores recibidos a los que tenga almacenados
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);

  } catch (error) {
    res.status(500).json(error);
  }

})

//delete
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted');
  } catch (error) {
    res.status(500).json(error);
  }
})

//get product
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error);
  }
})

//get products
router.get('/', async (req, res) => {
  const qGroup = req.query.group5;
  const qCategory = req.query.category;

  try {
    let products;

    if (qGroup) {
      products = qGroup ? await Product.find().sort({ _id: -1 }).limit(5) : await Product.find();
    }
    else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error);
  }
})


module.exports = router;