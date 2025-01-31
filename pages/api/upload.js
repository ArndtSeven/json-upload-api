const { IncomingForm } = require('formidable'); // Verwendung von require statt import
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

export const config = {
  api: {
    bodyParser: false, // Verhindert, dass Next.js den Body automatisch parst
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true }); // Initialisierung des Formulars

  try {
    // Parsen der Formulardaten
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
    const fileName = file.originalFilename || `uploaded_${Date.now()}.json`; // Falls kein Name, dann timestamp

    // **🚀 WICHTIGER FIX** – Verzeichnis für temporäre Dateien richtig setzen
    const uploadDir = path.join(os.tmpdir(), fileName); // Verwenden des temporären Verzeichnisses

    await fs.rename(file.filepath, uploadDir); // Umbenennen der Datei und Speichern an gewünschtem Ort

    // **💡 NEUE CODE-ZEILE HIER EINFÜGEN:**
    console.log(`✅ Datei gespeichert unter: ${uploadDir}`); // Debugging

    return res.status(200).json({ 
      message: 'File uploaded successfully', 
      filePath: uploadDir 
    });

  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error.message}` });
    console.log(`✅ Datei gespeichert unter: ${uploadDir}`);
  }
}
