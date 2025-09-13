export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return empty participants array
  const participants = [];
  
  res.status(200).json({ participants });
}
