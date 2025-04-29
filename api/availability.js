async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { propertyId } = req.query;

  if (!propertyId) {
    return res.status(400).json({ error: 'Missing propertyId parameter.' });
  }

  try {
    const lodgifyUrl = `https://api.lodgify.com/v2/availability/${propertyId}?includeDetails=false`;

    const lodgifyResponse = await fetch(lodgifyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.LODGIFY_API_KEY}` // <<< THIS is what you need
      }
    });

    const lodgifyText = await lodgifyResponse.text();
    console.log('Raw Lodgify Response:', lodgifyText);

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
