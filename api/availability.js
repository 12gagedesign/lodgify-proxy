// api/availability.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any domain to access
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { propertyId, periodStart, periodEnd } = req.query;

  if (!propertyId || !periodStart || !periodEnd) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  try {
    const lodgifyResponse = await fetch(`https://api.lodgify.com/v2/availability/${propertyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_API_KEY', // Uncomment and add your Lodgify API key if required
      },
      body: JSON.stringify({
        periodStart,
        periodEnd
      })
    });

    const data = await lodgifyResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error contacting Lodgify API:', error);
    return res.status(500).json({ error: 'Error contacting Lodgify API.' });
  }
}
