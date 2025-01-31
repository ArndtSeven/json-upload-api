import { IncomingForm } from 'formidable';
import fs from 'fs';
import os from 'os';
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

  const form = new IncomingForm({ keepExtensions: true });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const fileName = file.originalFilename || `uploaded_${Date.now()}.json`;

    // **🚀 WICHTIGER FIX** – Verzeichnis für temporäre Dateien richtig setzen
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileName);
    // **Erstelle den Ordner, falls er noch nicht existiert**
   if (!fs.existsSync(path.dirname(uploadDir))) {
  fs.mkdirSync(path.dirname(uploadDir), { recursive: true });
}

    }

    await fs.rename(file.filepath, uploadDir);

    // **Log-Ausgabe für den Speicherort der Datei**
    console.log(`✅ Datei gespeichert unter: ${uploadDir}`);

    return res.status(200).json({ 
      message: 'File uploaded successfully', 
      filePath: uploadDir 
    });

  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
