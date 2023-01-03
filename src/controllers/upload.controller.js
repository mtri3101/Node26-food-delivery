const { AppError } = require("../helpers/error");
const { response } = require("../helpers/response");

const upload = () => {
  return (req, res, next) => {
    const file = req.file;
    //Có thể validate loại file và kích thước bằng file.mimetype và file.size
    if (!file) {
      next(new AppError(400, "Please update a file"));
    }
    const tempUrl = `http://localhost:4000/${file.path}`;
    const newUrl = tempUrl.replace("static\\", "");
    res.status(200).json(response(newUrl));
  };
};

module.exports = {
  upload,
};
