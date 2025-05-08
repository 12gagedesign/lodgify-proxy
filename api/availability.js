async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { propertyId, start, end } = req.query;

  if (!propertyId || !start || !end) {
    return res.status(400).json({ error: 'Missing propertyId, start, or end parameter.' });
  }

  try {
    const lodgifyUrl = `https://api.lodgify.com/v2/availability/${propertyId}?start=${start}&end=${end}&includeDetails=true`;

    const lodgifyResponse = await fetch(lodgifyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-ApiKey': process.env.LODGIFY_API_KEY
      }
    });

    if (lodgifyResponse.status === 403) {
      return res.status(403).json({ error: 'Lodgify API key unauthorized (403)' });
    }

    const lodgifyText = await lodgifyResponse.text();

    if (!lodgifyText) {
      return res.status(502).json({ error: 'Empty response from Lodgify API.' });
    }

    const data = JSON.parse(lodgifyText);
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error contacting Lodgify API:', error.message);
    return res.status(500).json({ error: 'Error contacting Lodgify API.' });
  }
}

module.exports = handler;
