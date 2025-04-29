export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { propertyId, periodStart, periodEnd } = req.query;

  if (!propertyId || !periodStart || !periodEnd) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  try {
    // SEND as GET with query string (NOT POST with body)
    const lodgifyUrl = `https://api.lodgify.com/v2/availability/${propertyId}?periodStart=${periodStart}&periodEnd=${periodEnd}`;

    const lodgifyResponse = await fetch(lodgifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LODGIFY_API_KEY}`
      }
    });

    const data = await lodgifyResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error contacting Lodgify API:', error);
    return res.status(500).json({ error: 'Error contacting Lodgify API.' });
  }
}
