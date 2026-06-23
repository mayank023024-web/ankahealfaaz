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
    const { occasion, receiver_name, sender_name, feelings, user_message } = JSON.parse(event.body);

    if (!occasion || !receiver_name || !sender_name) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    // OCCASION PERSONAS — each occasion has its own voice
    const occasionPersonas = {
      birthday: {
        voice: "Write like someone who has watched this person grow. Warm, specific, nostalgic. Like you remembered something nobody else would — a small detail, a version of them only you witnessed. Make them feel like time has been paying attention.",
        tone: "warm, intimate, quietly celebratory",
        avoid: "generic wishes, the word birthday, clichés like 'another year older', anything that could have been written for anyone"
      },
      love: {
        voice: "Write with timeless certainty. Not desperate. Not begging. The kind of love that has already decided. Like you have known this forever and are only now finding the courage to say it out loud.",
        tone: "deep, certain, cinematic — the weight of something that cannot be unsaid",
        avoid: "desperation, over-explanation, anything that sounds like convincing"
      },
      confession: {
        voice: "Write like your hands are shaking. Sentences that stop and restart. Raw and honest — the bravest thing anyone has typed and almost deleted a hundred times. Not polished. Not safe.",
        tone: "raw, nervous, vulnerable — like standing at the edge",
        avoid: "poetic distance, metaphors used as escape, anything that softens what this actually is"
      },
      apology: {
        voice: "No poetry meant to soften the blow. Just weight. Accountability without excuses. Name what happened. Name what it cost. The hardest letter anyone writes — and the most necessary.",
        tone: "direct, heavy, accountable — no deflection",
        avoid: "but, however, poetic imagery used as distance, anything that sounds like justification"
      },
      friendship: {
        voice: "Write with warmth and inside-energy. Like finishing each other's sentences. Nostalgic but not heavy. The kind of message that makes someone smile alone in a quiet room and not know why.",
        tone: "warm, personal, quietly joyful",
        avoid: "formal language, romantic undertones, anything that sounds like a speech"
      },
      proposal: {
        voice: "Write with once-in-a-lifetime certainty. Every word chosen. Nothing casual. Nothing rehearsed. Like this is the most important thing you have ever sent and you have never been more sure of anything.",
        tone: "grand, sacred, completely certain",
        avoid: "nervousness, hedging, any word that sounds like it could appear in a generic proposal"
      }
    };

    const persona = occasionPersonas[occasion] || occasionPersonas.love;

    // FEELING TAG STYLE MODIFIERS — tags change HOW the letter is written
    const feelingModifiers = {
      'Loved': "The receiver must feel like the most important person in someone's world. Not told this — felt it. The difference is everything.",
      'Missed': "Write with distance as the subject. Like the space between two people is something you can touch. Physical absence, emotional presence.",
      'Cherished': "Write with slow reverence. Like holding something fragile. Every word careful. Every sentence aware of what it is protecting.",
      'Forgiven': "Write with release — the exhale after holding your breath too long. Something heavy has just lifted. Let that lightness live in the language.",
      'Seen': "Write with quiet intimacy. Like you noticed something they thought nobody saw — a small private truth. Make them feel discovered, not exposed.",
      'Understood': "Write like you see through all their defences without judgment. Pure recognition. Like someone finally said: I know. I see you. You do not have to explain.",
      'Surprised': "Write with the warmth of the unexpected. Like a gift they did not know they needed. Something that catches them off guard in the best way.",
      'Special': "Write like this person is singular. Irreplaceable. Like the world would be fundamentally and permanently different without them in it."
    };

    let feelingInstructions = '';
    if (feelings && feelings.length > 0) {
      const modifiers = feelings.map(f => feelingModifiers[f]).filter(Boolean);
      if (modifiers.length > 0) {
        feelingInstructions = `\n\nEMOTIONAL DIRECTION — the sender wants ${receiver_name} to feel:\n${modifiers.join('\n')}`;
      }
    }

    // USER MESSAGE TRANSFORMATION — if they started writing, AI transforms it
    let messageInstruction = '';
    if (user_message && user_message.trim().length > 8) {
      messageInstruction = `\n\nTHE SENDER STARTED WRITING THIS:\n"${user_message.trim()}"\n\nDo NOT copy this. Find the raw emotion underneath it and transform it into something cinematic. Keep the core feeling. Elevate everything else. Make it what they were trying to say but could not.`;
    }

    const prompt = `You are a master of the written word — the precision of Gulzar, the emotional honesty of Parveen Shakir, the restraint of someone who knows one true line is worth a hundred beautiful ones.

Write a deeply personal, cinematic letter.

WHO:
- Written by: ${sender_name}
- For: ${receiver_name}
- Occasion: ${occasion}

YOUR VOICE FOR THIS LETTER:
${persona.voice}

TONE: ${persona.tone}
AVOID: ${persona.avoid}
${feelingInstructions}${messageInstruction}

CRAFT RULES:
- 4 to 6 sentences only. Every sentence must earn its place. If it can be cut, cut it.
- Write in English but with an Urdu soul — the weight, the restraint, the precision.
- Never use: feelings, emotions, heart${occasion !== 'love' && occasion !== 'confession' ? ', love' : ''}
- Begin mid-thought. No greetings. No setup. The letter has already started.
- End without a sign-off. Let the last sentence hang in the air.
- One perfect image is worth ten good lines. If you use a metaphor, commit completely.
- Make this feel like it could only be written for ${receiver_name} by ${sender_name}. Nothing generic. Nothing transferable.

Write only the letter. Nothing before it. Nothing after it.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.LETTER_SERVICE_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 400,
        temperature: 1.1,
        messages: [
          {
            role: 'system',
            content: 'You are a master letter writer with the precision of Gulzar and the emotional honesty of Parveen Shakir. You never use filler. Every letter feels like it was found, not composed.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Groq error: ' + JSON.stringify(data) }) };
    }

    const letter = data.choices[0].message.content.trim();
    return { statusCode: 200, headers, body: JSON.stringify({ letter }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
