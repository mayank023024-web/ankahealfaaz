exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { occasion, receiver_name, sender_name, feelings } = JSON.parse(event.body);

    if (!occasion || !receiver_name || !sender_name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing fields' })
      };
    }

    const feelingText = feelings && feelings.length > 0
      ? feelings.join(', ')
      : 'deeply felt';

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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.LETTER_SERVICE_KEY
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 400,
        temperature: 0.9,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Groq error: ' + JSON.stringify(data) })
      };
    }

    const letter = data.choices[0].message.content.trim();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ letter })
    };

  } catch (err) {
    console.log('Error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
