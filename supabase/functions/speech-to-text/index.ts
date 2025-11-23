import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    console.log('Processing audio for transcription');

    const binaryAudio = processBase64Chunks(audio);
    
    // Try Sarvam AI first (primary)
    if (SARVAM_API_KEY) {
      try {
        console.log('Attempting transcription with Sarvam AI');
        const formData = new FormData();
        const blob = new Blob([binaryAudio], { type: 'audio/webm' });
        formData.append('file', blob, 'audio.webm');
        formData.append('model', 'saarika:v2.5');
        formData.append('language_code', 'kn-IN'); // Kannada language code

        const response = await fetch('https://api.sarvam.ai/speech-to-text', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_API_KEY,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Sarvam AI transcription successful:', result.transcript);
          return new Response(
            JSON.stringify({ text: result.transcript, provider: 'sarvam' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          const error = await response.text();
          console.warn('Sarvam AI failed, attempting fallback:', error);
        }
      } catch (sarvamError) {
        console.warn('Sarvam AI error, attempting fallback:', sarvamError);
      }
    }

    // Fallback to OpenAI
    if (OPENAI_API_KEY) {
      console.log('Attempting transcription with OpenAI (fallback)');
      const formData = new FormData();
      const blob = new Blob([binaryAudio], { type: 'audio/webm' });
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'kn'); // Kannada language code

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI Whisper error:', error);
        throw new Error(`Both Sarvam and OpenAI transcription failed. OpenAI error: ${error}`);
      }

      const result = await response.json();
      console.log('OpenAI transcription successful (fallback):', result.text);

      return new Response(
        JSON.stringify({ text: result.text, provider: 'openai' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('No API keys configured for speech-to-text');

  } catch (error) {
    console.error('Error in speech-to-text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
