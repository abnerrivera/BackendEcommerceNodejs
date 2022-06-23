const { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
} = require('./verifyToken');

const Cart = require('../models/Cart');
const router = require('express').Router();


//create
router.post('/create', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body)
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
})

//update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        //$set : reemplaza los valores recibidos a los que tenga almacenados
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);

  } catch (error) {
    res.status(500).json(error);
  }

})

//delete
router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted');
  } catch (error) {
    res.status(500).json(error);
  }
})

//get user Cart
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: require.params.userId});
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json(error);
  }
})

//get all products to Cart
router.get('/', verifyTokenAndAdmin, async (req, res) =>{
  try {
    const carts = await Cart.find();
    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;