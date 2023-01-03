const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

// const sequelize = require("./index")
// const sequelize = require(".");

module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      //Ép kiểu dữ liệu database: định nghĩa ra 1 model -> dùng model gọi đến những hàm query xuống database. Dựa vào kiểu dữ liệu ở đây để làm việc với các column
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        field: "first_name", //map column trong table thành first_name
      },
      lastName: {
        type: DataTypes.STRING(50),
        field: "last_name",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, //Không được trùng với record khác
        validate: {
          isEmail: {
            msg: "Invalid email",
          },
          //Demo custom validation
          // customValidator: (value) =>{
          //   //logic validation

          //   //nếu không thỏa mãn logic thì
          //   //throw new Error("message")
          // }
        },
      },
      // confirmPassword: {
      //   type: DataTypes.STRING,
      // },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   isMatchedConfirmPassword: (value) => {
        //     if (value !== this.confirmPassword) {
        //       throw new Error("confirm password not match");
        //     }
        //   },
        // },
        //Sẽ được chạy trước khi create hoặc update dữ liệu
        set(value) {
          //Không được lưu plaintext password trực tiếp xuống DB
          //Cần phải hash(mã hóa) password bằng thư viện bcrypt
          const salt = bcrypt.genSaltSync();
          const hashedPassword = bcrypt.hashSync(value, salt);
          //lưu hashPassword xuống db
          this.setDataValue("password", hashedPassword);
        },
      },
      role: {
        type: DataTypes.ENUM("user", "merchant", "admin"),
        defaultValue: "user",
      },
      avatar: {
        type: DataTypes.STRING,
        
      },
    },
    {
      tableName: "users",
      //disable createdAt, updatedAt
      timestamps: false,
      //Bỏ qua column password khi tìm kiếm các record
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      //Các phương thức được tự động chạy sau 1 hành động nào đó (create, update, delete...)
      hooks: {
        //Xóa property password của record được trả ra sau khi create/update user thành công
        afterSave: (record) => {
          delete record.dataValues.password;
        },
      },
    }
  );
};
