const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true } //muestra el tiempo de cuando es creado le usuario
);

module.exports = mongoose.model("User", UserSchema);