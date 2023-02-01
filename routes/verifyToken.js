import Jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    Jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ status: false, message: "Token Invalid" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res
      .status(400)
      .json({ status: false, message: "You are not authenticated" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res
        .status(400)
        .json({ status: false, message: "You are not allowded to do that" });
    }
  });
};
const verifyTokenAndisAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(400)
        .json({ status: false, message: "You are not allowded to do that" });
    }
  });
};
export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndisAdmin };
