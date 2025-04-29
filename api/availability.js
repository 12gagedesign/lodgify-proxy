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
    const lodgifyUrl = `https://api.lodgify.com/v2/availability/${propertyId}?periodStart=${periodStart}&periodEnd=${periodEnd}`;

    const lodgifyResponse = await fetch(lodgifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LODGIFY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const lodgifyText = await lodgifyResponse.text(); // read raw text
    console.log('Raw Lodgify Response:', lodgifyText);

    if (!lodgifyText) {
      console.error('Empty response from Lodgify API.');
      return res.status(502).json({ error: 'Empty response from Lodgify API.' });
    }

    const data = JSON.parse(lodgifyText); // only parse if there is text
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error contacting Lodgify API:', error.message);
    return res.status(500).json({ error: 'Error contacting Lodgify API.' });
  }
}
