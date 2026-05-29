import multer from 'multer';
import { config } from '../config/index.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error(`Unsupported file type: ${file.mimetype}`), { status: 415 }),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSizeMB * 1024 * 1024 },
});
