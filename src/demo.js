//demo nhiều tầng thành 1 file
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(express.json());

//Tạo kết nối db bằng Sequelize
//thay thế cho create connection của mysql2
const sequelize = new Sequelize("node26-food", "root", "1234", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

//Test connection có thành công hay không (tác vụ này bất đồng bộ)
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log("Sequelize Failed", error);
    //error thì ngừng chương trình luôn
    throw error;
  });

//Tạo model để Sequelize liên kết tới table và lấy/thêm/sửa/xóa data
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(50),
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    //Bỏ qua createdAt, updatedAt
    timestamps: false,
  }
);

//localhost:4000/api/v1/users
/*
  Vai trò folder:
  Router: "/api/v1/users" -> 
  Controller: async (req, res) -> chỉ xử lý liên quan đến request và response. Lấy những giá trị được parse ra truyền xuống services
  Services: xử lý logic ứng dụng
*/
app.get("/api/v1/users", async (req, res) => {
  try {
    //Lấy toàn bộ danh sách <=> select * from users
    const users = await User.findAll();
    //Query db thành công
    res.status(200).json({ data: users });
  } catch (error) {
    //Query db thất bại
    res.status(500).json({ error: error });
  }
});

app.listen(4000);
