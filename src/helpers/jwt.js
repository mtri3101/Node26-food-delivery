const jwt = require("jsonwebtoken");
const configs = require("../config");

const EXPIRES_IN = 60 * 60 * 12; //12h

//Payload là dữ liệu user muốn encode
const generateToken = (payload) => {
  //sign là hàm tạo ra chuỗi token
  const token = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
    },
    configs.SECRET_KEY, //secretkey
    {
      //Khi tạo ra chuỗi token, muốn sau bao lâu thì hết hạn => expiresIn
      expiresIn: EXPIRES_IN,
    }
  );
  return {
    token,
    expiresIn: EXPIRES_IN,
  };
};

module.exports = {
  generateToken,
};
