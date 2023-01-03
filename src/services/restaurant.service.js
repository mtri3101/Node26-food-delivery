const { AppError } = require("../helpers/error");
const { Restaurant, User } = require("../models");

const getRestaurants = async () => {
  try {
    const restaurants = await Restaurant.findAll({
      // include: {
      //   association: "userLikes",
      //   //Nếu không lấy bảng phụ (RestaurantLikes)
      //   through:{
      //     attributes: [],
      //   }
      //  },

      //Lấy thêm user(res owner) và userLikes
      include: [
        {
          association: "owner",
          attributes: {
            exclude: ["email", "password"],
          },
        },
        {
          association: "userLikes",
          //Bỏ qua các attribute(không trả về api), bao gồm cả các atrribute mặc định trong defaultValue trong models
          attributes: {
            exclude: ["email", "password"],
          },
          //Trong through để gì thì trả về cái đó, còn lại ko trả qua api
          through: {
            attributes: ["createdAt"],
          },
        },
        {
          association: "userRates",
          through: {
            attributes: ["amount"],
          },
        },
      ],
    });
    return restaurants;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createRestaurant = async (data) => {
  try {
    const restaurant = await Restaurant.create(data);
    return restaurant;
  } catch (error) {
    throw error;
  }
};

const likeRestaurant = async (userId, restaurantId) => {
  try {
    //Tìm ra nhà hàng muốn like
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new AppError(400, "Restaurant not found");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(400, "User not found");
    }

    //Khi thiết lập relationship cho các model, mặc định sequelize sẽ tạo ra các phương thức cho các model để tương tác với các model khác
    //Kiểm tra các method của object restaurant
    console.log(restaurant.__proto__);
    //Thêm user vào bảng like_res
    // await restaurant.addUserLike(user.id); //type promise

    //Kiểm tra xem userLike có hay không trong db => return về dạng true/false
    const hasLiked = await restaurant.hasUserLike(user.id);
    if (hasLiked) {
      //Nếu đã like rồi thì remove => unlike
      await restaurant.removeUserLike(user.id);
    } else {
      //Chưa like thì thêm vào
      await restaurant.addUserLike(user.id);
    }

    return null;
  } catch (error) {
    throw error;
  }
};

const rateRestaurant = async (userId, restaurantId, amountRate) => {
  try {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new AppError(400, "Restaurant not found");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(400, "User not found");
    }

    // console.log(restaurant.__proto__);
    if (amountRate > 5 || amountRate < 1) {
      throw new AppError(400, "Please rate between 1 and 5");
    }
    await restaurant.addUserRate(user.id, { through: { amount: amountRate } });
    // if (hasRated) {
    //   throw new AppError(400, "This user has already rated");
    // } else {
    //   if (amountRate < 0 || amountRate > 5) {
    //     throw new AppError(400, "Please rate between 1 to 5");
    //   } else {
    //     await restaurant.addUserRate(user.id, {
    //       through: { amount: amountRate },
    //     });
    //   }
    // }
    return null;
  } catch (error) {
    throw error;
  }
};

//requester là thông tin user thực hiện request này
const deleteRestaurant = async (restaurantId, requester) => {
  try {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new AppError(400, "Restaurant not found");
    }

    //Kiểm tra xem người xóa restaurant có phải là chủ restaurant hay không
    if (restaurant.userId !== requester.id) {
      throw new AppError(403, "No have permission");
    }

    //Xóa restaurant nếu pass 2 if
    await Restaurant.destroy({ where: { id: restaurantId } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRestaurants,
  createRestaurant,
  likeRestaurant,
  rateRestaurant,
  deleteRestaurant,
};
