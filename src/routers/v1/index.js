//Routers v1
const express = require("express");
const userController = require("../../controllers/users.controller");
const restaurantController = require("../../controllers/restaurant.controller");
const authController = require("../../controllers/auth.controller");
const authorization = require("../../middlewares/authorization");
const requiredRole = require("../../middlewares/requiredRole");
const uploadController = require("../../controllers/upload.controller");
const upload = require("../../middlewares/upload")

//path: /api/v1
const v1 = express.Router();

//Định nghĩa các routers cho table users
v1.get("/users", userController.getUsers());
v1.get("/users/:id", userController.getUsersByID());
v1.post("/users", userController.createUser());
v1.delete("/users/:id", userController.deleteUser());
v1.put("/users/:id", userController.updateUser());

//Định nghĩa các routers cho table restaurants
v1.get("/restaurants", restaurantController.getRestaurants());
v1.post(
  "/restaurants/:restaurantId/like",
  authorization,
  restaurantController.likeRestaurant()
);
v1.post(
  "/restaurants/:restaurantId/rate/",
  restaurantController.rateRestaurant()
);
v1.post(
  "/restaurants",
  authorization,
  requiredRole("merchant", "admin"),
  restaurantController.createRestaurant()
);
v1.delete(
  "/restaurants/:id",
  authorization,
  restaurantController.deleteRestaurant()
);

//Định nghĩa các routers cho auth
v1.post("/login", authController.login());
v1.get("/profiles", authorization, authController.getProfile());

//Định nghĩa router cho update
v1.post("/upload", upload.single("file"), uploadController.upload());
module.exports = v1;
