const { response } = require("../helpers/response");
const restaurantService = require("../services/restaurant.service");

const getRestaurants = () => {
  return async (req, res, next) => {
    try {
      const restaurants = await restaurantService.getRestaurants();
      res.status(200).json(response(restaurants));
    } catch (error) {
      next(error);
    }
  };
};

//localhost:4000/restaurants/:restaurantId/like-body:{userId: 1}
const likeRestaurant = () => {
  return async (req, res, next) => {
    try {
      const { restaurantId } = req.params;
      //Lấy id từ token
      const { user } = req.locals;
      await restaurantService.likeRestaurant(user.id, restaurantId);
      res.status(200).json(response("OK"));
    } catch (error) {
      next(error);
    }
  };
};

const rateRestaurant = () => {
  return async (req, res, next) => {
    try {
      const { restaurantId } = req.params;
      const { userId, amount } = req.body;
      await restaurantService.rateRestaurant(userId, restaurantId, amount);
      res.status(200).json(response("OK"));
    } catch (error) {
      next(error);
    }
  };
};

//Yêu cầu login mới tạo ra được restaurant
const createRestaurant = () => {
  return async (req, res, next) => {
    try {
      const { user } = res.locals;
      //Truyền vào data mà không cần truyền id của user owner do đã có token
      const data = req.body;
      //set userid, là thông tin người tạo nhà hàng
      data.userId = user.id;

      const restaurant = await restaurantService.createRestaurant(data);
      res.status(200).json(response(restaurant));
    } catch (error) {
      next(error);
    }
  };
};

const deleteRestaurant = () => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const { user } = res.locals;
      await restaurantService.deleteRestaurant(id, user);
      res.status(200).json(response(true));
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  getRestaurants,
  likeRestaurant,
  rateRestaurant,
  createRestaurant,
  deleteRestaurant,
};
