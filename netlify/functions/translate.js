exports.handler = async (event) => {
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*' };
  const text = event.queryStringParameters && event.queryStringParameters.text;

  if (!text) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing text' }) };
  }

  try {
    const res = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|pt-BR');
    const data = await res.json();
    const translated = data && data.responseData ? data.responseData.translatedText : null;
    return { statusCode: 200, headers, body: JSON.stringify({ translatedText: translated }) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ translatedText: null }) };
  }
};
