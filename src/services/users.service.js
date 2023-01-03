//Cấu trúc nhiều lớp: từ index.js > index.router.js > users.router.js > users.controller.js > users.service.js
const { AppError } = require("../helpers/error");
const { User, Restaurant } = require("../models");

//Services nhận vào data từ controller
//Nhiệm vụ của services: xử lý nghiệp vụ của ứng dụng(xử lý logic) sau đó gọi tới model của sequelize để query xuống database, nhận data từ db return về cho controller

const getUsers = async () => {
  //getList = findAll
  try {
    const users = await User.findAll({ include: "restaurants" });
    return users;
  } catch (error) {
    //Đưa error lên controller -> trả về client
    throw error;
  }
};

const getUsersByID = async (userId) => {
  //getList = findAll
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    //Đưa error lên controller -> trả về client
    throw error;
  }
};

const createUser = async (data) => {
  try {
    const user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    // nếu Email đã tồn tại trong db
    //Throw trên try thì sẽ chạy xuống catch và phần bên dưới của try sẽ không chạy
    if (user) {
      throw new AppError(400, "Email is existed");
    }

    //Ví dụ trong trường hợp admin thêm user, chỉ cần dùng email, ta cần phải tạo 1 password ngẫu nhiên
    if (!data.password) {
      value = Math.random().toString(36).substring(2);
      //Gửi email về cho user password random này
    }

    const createdUser = await User.create(data);
    return createdUser;
  } catch (error) {
    //Throw ở catch thì sẽ chạy đến controller
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    //Nếu không tìm thấy id => trả về lỗi
    if (!user) {
      throw new AppError(400, "User not found");
    }

    await User.destroy({ where: { id: userId } });
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, data) => {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    //Nếu không tìm thấy id => trả về lỗi
    if (!user) {
      throw new AppError(400, "User not found");
    }
    const userUpdate = await User.update(data, { where: { id: userId } });
    return userUpdate;
  } catch (error) {
    throw error;
  }
};

//Update:
//- User.findOne({where:{id:1}}) - Nếu không tìm thấy trả về lỗi
//- User.update(data,{where:{id:1}})
//- User.findOne({where:{id:1}})

module.exports = {
  getUsers,
  getUsersByID,
  createUser,
  deleteUser,
  updateUser,
};
