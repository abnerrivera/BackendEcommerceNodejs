const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_JWT, (error, user) => {
      if (error) res.status(403).json("Token is not valid");
      req.user = user;
      next(); //se sale de esta funcion y regresa a la funcion ruta
    });
  } else {
    return res.status(401).json('You are not authenticated')
  }
};

//vericifa si es el mismo id del usuario para editarse a si mismo o si es admin
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not alowed to do that')
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not alowed to do that')
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
};