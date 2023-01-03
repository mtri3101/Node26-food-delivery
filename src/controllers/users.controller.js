//Cấu trúc nhiều lớp: từ index.js > index.router.js > users.router.js > users.controller.js

// Controller nhận vào request và response. Nhiệm vụ chỉ parse request (params, body) sau đó chuyển xuống services xử lý, nhận kết quả trả về từ services -> trả response về cho client

const { response } = require("../helpers/response");
const userService = require("../services/users.service");

//Hàm chạy khi api được trigger
// const getUsers = () => async (req, res) => {
//   try {
//     const users = await userService.getUsers();
//     res.status(200).json({ data: users });
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// };

//Closure function
//Viết cách này thì tự động chạy hàm => không cần api phải trigger

//outer func
const getUsers = () => {
  //inner func
  return async (req, res, next) => {
    try {
      const users = await userService.getUsers();
      res.status(200).json(response(users));
    } catch (error) {
      //Bắt error từ services (không phải crash) => không throw nữa mà trả kết quả về client
      // res.status(500).json({ error: error.message });
      //Dùng next để chuyển tiếp error xuống middleware handleError
      next(error);
    }
  };
};

const getUsersByID = () => {
  //inner func
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const users = await userService.getUsersByID(id);
      res.status(200).json({ data: users });
    } catch (error) {
      //Bắt error từ services (không phải crash) => không throw nữa mà trả kết quả về client
      // res.status(500).json({ error: error.message });
      //Dùng next để chuyển tiếp error xuống middleware handleError
      next(error);
    }
  };
};

const createUser = () => {
  return async (req, res, next) => {
    try {
      const user = req.body;
      const createdUser = await userService.createUser(user);
      res.status(200).json(response(createdUser));
    } catch (error) {
      // res.status(500).json({ error: error.message });
      next(error);
    }
  };
};

const deleteUser = () => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);
      res.status(200).json(response(true));
    } catch (error) {
      // res.status(500).json({ error: error.message });
      next(error);
    }
  };
};

const updateUser = () => {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.body;
      await userService.updateUser(id, user);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  getUsers,
  getUsersByID,
  createUser,
  deleteUser,
  updateUser,
};
