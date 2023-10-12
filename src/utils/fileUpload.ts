import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const storage = new Storage({
  keyFilename: process.env.GCS_KEYFILE_PATH,
});

export async function uploadToGCS(file, folder, fileName = ''): Promise<string> {
  let path;
  if (fileName) {
    fileName = removeFileExtension(fileName);
    fileName = `${fileName}-${uuidv4()}.${file?.originalname?.split('.').pop()}`;
    path = `${folder}/${fileName}`;
  } else {
    path = `${folder}/${uuidv4()}.${file?.originalname?.split('.').pop()}`;
  }

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
  const fileToUpload = bucket.file(path);

  const stream = fileToUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype, // Set the content type based on the file's mimetype
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', () => {
      resolve(`https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${path}`);
    });

    stream.end(file.buffer);
  });
}

export function generateShortUUID() {
  const fullUUID = uuidv4();
  return fullUUID.split('-')[0].substr(0, 20);
}

export async function uploadLocalFile(fileName): Promise<string> {
  // Đọc nội dung của tệp cục bộ
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, async (err, data) => {
      if (err) {
        console.error(`Error reading local file: ${err}`);
        return;
      }

      // Thực hiện tải lên Google Cloud Storage
      try {
        const folder = 'db-crawled'; // Thay thế bằng tên thư mục mong muốn
        console.log("fileName",fileName)
        const gcsUrl = await uploadToGCS({ buffer: data, originalname: fileName }, folder,fileName);

        resolve(gcsUrl);
        console.log(`File crawled uploaded to Google Cloud Storage. URL: ${gcsUrl}`);
      } catch (uploadError) {
        console.error(`Error uploading file to Google Cloud Storage: ${uploadError}`);
        reject(uploadError);
      }
    });
  });
}

// Function to remove the file extension
function removeFileExtension(fileName) {
  try {
    var lastDotIndex = fileName.lastIndexOf('.');

    // Check if a dot is present and remove the extension if found
    if (lastDotIndex !== -1) {
      var newFileName = fileName.substring(0, lastDotIndex);
      return newFileName;
    } else {
      // If no dot is found, return the original string
      return fileName;
    }
  } catch (e){
    return fileName
  }
}
