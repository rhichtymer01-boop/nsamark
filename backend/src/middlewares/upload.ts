import fs from 'node:fs';
import path from 'node:path';

import multer from 'multer';

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createStorage = (folder: string) => {
  const destination = path.resolve(process.cwd(), 'uploads', folder);
  ensureDir(destination);

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      cb(null, `${timestamp}-${safeName}`);
    }
  });
};

export const kycUpload = multer({
  storage: createStorage('kyc'),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
