const { getStore } = require('@netlify/blobs');

function getBlobStore() {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: 'maha-ingles-data', siteID, token });
  }
  return getStore('maha-ingles-data');
}

exports.handler = async (event) => {
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*' };
  const key = event.queryStringParameters && event.queryStringParameters.key;

  if (!key) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing key' }) };
  }

  try {
    const store = getBlobStore();

    if (event.httpMethod === 'GET') {
      const raw = await store.get(key);
      return { statusCode: 200, headers, body: JSON.stringify({ value: raw ? JSON.parse(raw) : null }) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      await store.set(key, JSON.stringify(body.value));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === 'DELETE') {
      await store.delete(key);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method not allowed' }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'storage error', detail: String(e) }) };
  }
};
