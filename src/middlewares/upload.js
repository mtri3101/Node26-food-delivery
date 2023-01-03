const multer = require("multer");

//Return về 1 storeEngine -> lưu file đó vào nơi chứa source code server
const storage = multer.diskStorage({
  //Set up đường dẫn muốn save file
  destination: (req, file, cb) => {
    //cb: dùng để set up thư mục file đó được lưu vào
    cb(null, "./static/");
  },
  //Format lại filename (Vd 2 file up lên cùng thời điểm, cùng tên) => tạo tên unique
  filename: (req, file, cb) => {
    //Overwrite filename để tránh trường hợp cùng tên
    const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${prefix}-${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = upload;
