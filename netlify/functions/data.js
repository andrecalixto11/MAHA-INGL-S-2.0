const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*' };
  const key = event.queryStringParameters && event.queryStringParameters.key;

  if (!key) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing key' }) };
  }

  try {
    const store = getStore('maha-ingles-data');

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
