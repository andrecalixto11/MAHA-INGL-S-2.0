exports.handler = async (event) => {
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*' };
  const word = event.queryStringParameters && event.queryStringParameters.word;

  if (!word) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing word' }) };
  }

  try {
    const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word));
    if (!res.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ examples: [] }) };
    }
    const data = await res.json();
    const examples = [];
    outer:
    for (const entry of data) {
      for (const meaning of (entry.meanings || [])) {
        for (const def of (meaning.definitions || [])) {
          if (def.example) {
            examples.push(def.example);
            if (examples.length >= 2) break outer;
          }
        }
      }
    }
    return { statusCode: 200, headers, body: JSON.stringify({ examples }) };
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ examples: [] }) };
  }
};
