import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { textContext, chapterNumber } = await req.json();
    console.log('Generating image for chapter:', chapterNumber);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create a rich, tangible prompt based on the captured text - NO TEXT IN IMAGE
    const imagePrompt = `CRITICAL: DO NOT INCLUDE ANY TEXT, LETTERS, WORDS, OR WRITING IN THIS IMAGE.

Based on this narrative passage, create a highly tangible, physical sci-fi illustration that captures the mood and visuals described:

"${textContext}"

Interpret the passage literally - if it describes specific objects, environments, actions, or emotions, visualize those directly. Extract concrete visual elements from the text:
- Physical objects and environments mentioned
- Lighting conditions and atmosphere described
- Characters' positions and actions
- Emotional tone and mood
- Spatial relationships and scale

Style requirements:
- Moody space aesthetic with gray fog and cosmic dust where appropriate
- Deep blacks contrasted with glowing cyan/teal/blue accents for technology
- Bioluminescent organic elements for living things
- Cinematic composition with atmospheric depth
- Painterly texture and careful lighting
- NO text, letters, symbols, or written language anywhere in the image

Atmosphere: Match the emotional tone of the passage - whether contemplative, tense, haunting, or beautiful. Focus on tangible physical details - textures, materials, lighting, forms.

Technical: Ultra high resolution, dramatic lighting with specific light sources, layered fog for depth, photorealistic material rendering.`;

    console.log('Sending request to Lovable AI for chapter', chapterNumber);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: imagePrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from AI Gateway');
    
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image URL in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    console.log('Image generated successfully, size:', imageUrl.length, 'bytes');

    return new Response(
      JSON.stringify({ 
        imageUrl,
        chapterNumber,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
