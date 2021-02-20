const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
      // get the token out of the request headers
      const token = req.headers.authorization.split(" ")[1];

      // decode the token
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      // set the userData property according to the decoded token data
      req.userData = { email: decodedToken.email, userId: decodedToken.userId };
      next();
    } catch (error) {
        // in case of an error, return an error with a message and unauthorized status code
        res.status(401).json({message: 'You are not authenticated!'});
    }
    
}

