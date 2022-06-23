//iniciamos nuestra app con express
const express = require('express');
const app = express();

mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');

dotenv.config();


//connect to server db
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => console.log('DB connection established'))
  .catch(
    (error) => console.log(`DB connection error: ${error}`)
  )

app.use(express.json());
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`backend is running on port: ${port}`);
});