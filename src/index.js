const express = require("express");
const { sequelize } = require("./models");
const { AppError, handleErrors } = require("../src/helpers/error");
const authorization = require("./middlewares/authorization");
const app = express();

app.use(express.json());
//Truy cập được file static
app.use(express.static("./static"));

//Sync model của sequelize với db
sequelize.sync({ alter: true });

const v1 = require("./routers/v1");

app.use("/api/v1", v1);

//demo handleError
// app.get("/error", (req, res, next) => {
//   throw new AppError(500, "Internal Server");
// });

//app.use là từ khóa để gắn middleware
//Middleware này dùng để bắt và xử lý trả lỗi ra cho client (phải được đặt bên dưới các router)
app.use(handleErrors);

app.listen(4000);
