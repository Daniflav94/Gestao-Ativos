import multer from "multer";
import path from "path";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import crypto from "crypto";
import { S3Client } from "@aws-sdk/client-s3";

type StorageType = "local" | "s3";

const s3Config = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const fileStorage: { [key in StorageType]: multer.StorageEngine } = {
  local: multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = "invoices";
      cb(null, `uploads/${folder}/`);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        cb(null, `${hash.toString("hex")}-${file.originalname}`);
      });
    },
  }),
  s3: multerS3({
    s3: s3Config,
    bucket: process.env.BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),
};

export const fileUpload = multer({
  storage: fileStorage[process.env.STORAGE_TYPE as StorageType],
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
      return cb(new Error("Por favor, envie apenas png, jpg, jpeg ou pdf!"));
    }
    cb(null, true);
  },
});
