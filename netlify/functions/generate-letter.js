exports.handler = async function(event) {
  if(event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if(event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { occasion, receiver_name, sender_name, feelings } = JSON.parse(event.body);

    if(!occasion || !receiver_name || !sender_name) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const feelingText = feelings && feelings.length > 0 ? feelings.join(', ') : 'deeply felt';

    const prompt = `You are a poet in the tradition of Gulzar and Parveen Shakir. Write a deeply personal, cinematic letter for someone.

Details:
- This is a ${occasion} message
- Written by: ${sender_name}
- For: ${receiver_name}
- The feeling behind it: ${feelingText}

Rules:
- Write in English but with an Urdu soul
- 4 to 6 sentences only. No more.
- Short sentences. Sometimes fragments. They hit harder.
- Never use the words: feelings, emotions, heart, love (unless it is a love/confession occasion)
- Use sensory language: rain, silence, 3am, fragrance, shadow, light
- Do not explain the emotion. Show the image instead.
- No greetings like Dear or Hello. Start directly with the message.
- End naturally. No sign-off.
- Make it feel like it was written only for ${receiver_name}. Completely personal.

Write only the letter. Nothing else.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if(!data.content || !data.content[0]) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Generation failed' }) };
    }

    const letter = data.content[0].text.trim();
    return { statusCode: 200, headers, body: JSON.stringify({ letter }) };

  } catch(err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Something went wrong' }) };
  }
};
