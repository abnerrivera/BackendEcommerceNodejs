const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('./verifyToken');

const Order = require('../models/Order');
const router = require('express').Router();


//create
router.post('/create', verifyToken, async (req, res) => {
  const newOrder = new Order(req.body)
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
})

//update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        //$set : reemplaza los valores recibidos a los que tenga almacenados
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);

  } catch (error) {
    res.status(500).json(error);
  }

})

//delete
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json('Order has been deleted');
  } catch (error) {
    res.status(500).json(error);
  }
})

//get user Order
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: require.params.userId });
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error);
  }
})

//get all orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders)
  } catch (error) {
    res.status(500).json(error);
  }
})

//get monthly orders
router.get('/income', verifyTokenAndAdmin, async (req, res) => {

  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); //mes anterior
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)); //mes anterior al anterior

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;