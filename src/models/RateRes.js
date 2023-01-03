const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "RateRes",
    {
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        field: "restaurant_id",
      },
      amount: {
        type: DataTypes.INTEGER,
        validate:{
          min:1,
          max:5
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "date_rate",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "rate_res",
      timestamps: false,
    }
  );
};
