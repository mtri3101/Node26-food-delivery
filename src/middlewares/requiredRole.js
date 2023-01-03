//Middleware kiểm tra quyền cần được gọi sau middleware authorization

const { AppError } = require("../helpers/error");

//role:array
const requiredRole = (...roles) => {
  return (req, res, next) => {
    const { user } = res.locals;

    const isMatched = roles.includes(user.role);
    //Không có quyền thì trả error
    if (!isMatched) {
      next(new AppError(403, "No have permission"));
      return
    }
    next();
  };
};

module.exports = requiredRole;
