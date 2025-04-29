
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { propertyId, periodStart, periodEnd } = req.body;

  if (!propertyId || !periodStart || !periodEnd) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const lodgifyResponse = await fetch(`https://api.lodgify.com/v2/availability/${propertyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization here if needed
      },
      body: JSON.stringify({
        periodStart,
        periodEnd,
      }),
    });

    const data = await lodgifyResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error contacting Lodgify API', details: error.message });
  }
}
