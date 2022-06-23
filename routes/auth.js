const router = require('express').Router();
const User = require('../models/User');
//encript password
const CryptoJS = require('crypto-js');
//jwt
const jwt = require('jsonwebtoken');


//register
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    
    const {password, ...others} = savedUser._doc;
    
    res.status(200).json({...others});
  } catch (error) {
    res.status(500).json(error);
  }

})

//login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(401).json("Wrong credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PASS
    )

    //se usa el utf para que reciba cualquier caracter
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password && res.status(401).json("Wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_JWT,
      {expiresIn: "1d"} //expiracion en dias
    );

    //envia el resto de datos de user menos el password destructuracion
    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken})

  } catch (error) {
    res.status(500).json(error)
  }
});

module.exports = router;