import fs from 'fs/promises';  // Verwenden der asynchronen fs-API
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Pfad zur Datei
  const filePath = path.join('/tmp', 'test.json');

  try {
    // Überprüfen, ob die Datei existiert
    await fs.access(filePath);  // asynchron und ohne Blockierung
    const fileContent = await fs.readFile(filePath, 'utf8');  // asynchrone Dateilesung

    // Erfolgreiches Abrufen der Datei
    return res.status(200).json({ message: 'File retrieved successfully', data: JSON.parse(fileContent) });
  } catch (error) {
    // Fehlerbehandlung für den Fall, dass die Datei nicht existiert
    return res.status(404).json({ error: 'File not found' });
  }
}
