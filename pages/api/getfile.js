import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filePath = path.join('/tmp', 'test.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  res.status(200).json({ message: 'File retrieved successfully', data: JSON.parse(fileContent) });
}
