import multer from "multer";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

type StorageType = "local" | "s3";

interface MulterFileWithLocation extends Express.Multer.File {
  location?: string;
}

const s3Config = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const storageLocal = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "invoices";
    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err, "");
      cb(null, `${hash.toString("hex")}-${file.originalname}`);
    });
  },
});

const uploadLocal = multer({ storage: storageLocal });

const uploadS3 = multer({ storage: multer.memoryStorage() });

const uploadToS3 = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const fileBuffer = req.file.buffer;
  const hash = crypto.randomBytes(16).toString("hex");
  const fileName = `${hash}-${req.file.originalname}`;

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME as string,
    Key: fileName,
    Body: fileBuffer,
    ContentType: req.file.mimetype,
  };

  try {
    const parallelUploads3 = new Upload({
      client: s3Config,
      params: uploadParams,
    });

    const result = await parallelUploads3.done();

    if (result && result.Location) {
      (req.file as MulterFileWithLocation).location = result.Location; 
    } else {
      (req.file as MulterFileWithLocation).location = `https://${process.env.BUCKET_NAME}.s3.${s3Config.config.region}.amazonaws.com/${fileName}`;
    }

    next();
  } catch (err) {
    console.error("Error uploading to S3", err);
    res.status(500).send("Error uploading file to S3");
  }
};

export const fileUpload = (process.env.STORAGE_TYPE as StorageType === "s3" ? [uploadS3.single("invoice"), uploadToS3] : [uploadLocal.single("invoice")]);
