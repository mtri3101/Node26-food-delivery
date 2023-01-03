//setup Sequelize
const { Sequelize } = require("sequelize");
const configs = require("../config");

const sequelize = new Sequelize(
  configs.DB_NAME,
  configs.DB_USER,
  configs.DB_PASSWORD,
  {
    dialect: configs.DB_DIALECT,
    host: configs.DB_HOST,
    port: configs.DB_PORT,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize Connected");
  } catch (error) {
    console.log("Sequelize Error", error);
  }
})();

//Khởi tạo model
// const UserFn = require("./User") => trả về function
// const User = UserFn(sequelize)   => truyền vào tham số là sequelize
const User = require("./User")(sequelize);
const Restaurant = require("./Restaurant")(sequelize);
const RestaurantLikes = require("./RestaurantLikes")(sequelize);
const RateRes = require("./RateRes")(sequelize);

//Định nghĩa relationship giữa các model
//User 1-n restaurant
Restaurant.belongsTo(User, { as: "owner", foreignKey: "userId" });
User.hasMany(Restaurant, { as: "restaurants", foreignKey: "userId" });

//User - Like - Restaurant
//User 1-n RestaurantLikes
//Restaurant 1-n RestaurantLikes
User.belongsToMany(Restaurant, {
  as: "restaurantLikes",
  through: RestaurantLikes,
  foreignKey: "userId",
});
Restaurant.belongsToMany(User, {
  as: "userLikes",
  through: RestaurantLikes,
  foreignKey: "restaurantId",
});

//User - Rate - Restaurant
//User 1-n RateRes
//RateRes 1-n Restaurant
User.belongsToMany(Restaurant, {
  as: "restaurantRates",
  through: RateRes,
  foreignKey: "userId",
});
Restaurant.belongsToMany(User, {
  as: "userRates",
  through: RateRes,
  foreignKey: "restaurantId",
});

module.exports = {
  sequelize,
  User,
  Restaurant,
};
