const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const User = require('../models/User');


const router = require('express').Router();

//update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {

  //confirm password
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      procces.env.SECRET_JWT
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json(error);
  }

})

//delete
router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted');
  } catch (error) {
    res.status(500).json(error);
  }
})

//get user
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others })
  } catch (error) {
    res.status(500).json(error);
  }
})

//get users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.group5
  try {
    const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error);
  }
})

//get user stats
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([ //aggregate : es como un for
      { //$match: filtra // $gte: mayor o mayor e igual que (filtra todo lo creado despues al año pasado)
        $match: { createdAt: { $gte: lastYear } } },
      {
        //$project: trae solo el valor especificado
        $project: {
          month: { $month: "$createdAt" } //trae la propiedad mes y su valor de cada item
        }
      },
      {
        //$group: agrupa segun lo especificado
        $group: {
          _id: "$month", //mes en que fue creado
          total: { $sum: 1} //usuarios creados en ese mes
        }
      }
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
})


module.exports = router;