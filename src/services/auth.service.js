const { AppError } = require("../helpers/error");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");

const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    const user = await User.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });

    if (!user) {
      throw new AppError(400, "Email or password invalid");
    }

    //So sánh password user nhập với password hash trong data bằng compareSync
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      throw new AppError(400, "Email or password invalid");
    }
    // //Xóa password trước khi return
    // delete user.dataValues.password;

    return generateToken(user);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
};
