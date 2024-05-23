import multer from "multer";
import path from "path";

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "invoices";

    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const fileUpload = multer({
  storage: fileStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
      return cb(new Error("Por favor, envie apenas png, jpg, jpeg ou pdf!"));
    }

    cb(null, true);
  },
});
