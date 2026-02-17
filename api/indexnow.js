
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');

    if (req.method === 'GET') {
        return res.status(200).json({ message: 'IndexNow API is active' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { host, key, keyLocation, urlList } = req.body;

        // Basic validation
        if (!host || !key || !urlList || !Array.isArray(urlList)) {
            return res.status(400).json({ error: 'Missing required fields: host, key, urlList' });
        }

        // Forward to IndexNow
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                host,
                key,
                keyLocation,
                urlList
            }),
        });

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'URLs submitted to IndexNow' });
        } else {
            const errorText = await response.text();
            return res.status(response.status).json({ success: false, error: 'IndexNow Error', details: errorText });
        }

    } catch (error) {
        console.error('IndexNow API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
