import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the file' });
    }

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = files.file[0];
    const newPath = path.join('/tmp', file.originalFilename);

    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving the file' });
      }

      res.status(200).json({ message: 'File uploaded successfully', filePath: newPath });
    });
  });
}
