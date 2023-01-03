//Tạo ra instance error
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

//err: instance của AppError
const handleErrors = (err, req, res, next) => {
  //Kiểm tra xem err có phải là instance của AppError không?
  //Nếu là những lỗi không phải là instace của appError, có thể vì lý do nào đó mà mình chưa biết được
  if (!err instanceof AppError) {
    err = new AppError(500, "Internal Server");
  }

  //Nếu err là instance của AppError, nghĩa là err là mình đã biết và xử lý
  const { message, statusCode } = err;
  res.status(statusCode).json({
    status: "error",
    message: message,
  });

  //Nếu có các middleware phía sau -> gọi next để đi tới các middleware phía sau
  next();
};

module.exports = {
  AppError,
  handleErrors,
};
