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

    // Rich narrative context for each chapter
    const chapterContexts: Record<number, string> = {
      1: "Inside a black hole: spherical spacecraft, gray fog environment, destroyed ship debris, cosmic horror atmosphere, isolation",
      2: "Interior greenhouse chamber: withered plants, terracotta pots, failed botanical experiments, dim lighting, sparse vegetation",
      3: "Cosmic dust storm: massive dust mountains, towering formations, overwhelming scale, intense light from above, valleys of shadow",
      4: "Hatching chamber: organic egg in amber liquid, cracking shell, emerging life form, ochre colored broth, dim atmosphere",
      5: "Destroyed garden: buried daffodils, broken pottery, inverted tree with exposed roots, storm damage, chaos and debris",
      6: "Discovery moment: opalescent pearl, shifting iridescent colors, dim light, precious object, blue green purple hues",
      7: "Garden tending: gentle hands on plant stems, careful plant care, greenhouse environment, growing vegetation, nurturing touch",
      8: "Burning structure: building collapsing into flames, twilight dawn sky, ash and embers, destruction and fire",
      9: "Suspended in void: figure floating in viscous gray substance, weightless, between drowning and floating, liminal space",
      10: "Standing at edge: two silhouettes on platform edge, gray horizon, dust meeting sky, shared contemplation, vastness",
      11: "Cosmic eyes: close view of eyes with galaxies inside, starlight reflected in pupils, swirling cosmic patterns, deep space in gaze",
      12: "Ship awakening: spherical spacecraft with systems activating, control panels lighting up, energy flowing, gentle vibration, glow spreading"
    };

    const narrativeContext = chapterContexts[chapterNumber] || "A scene from a space exploration story.";

    // Create a rich, tangible prompt - NO TEXT IN IMAGE
    const imagePrompt = `CRITICAL: DO NOT INCLUDE ANY TEXT, LETTERS, WORDS, OR WRITING IN THIS IMAGE.

Create a highly tangible, physical sci-fi illustration: ${narrativeContext}

Visual reference from scene: ${textContext.substring(0, 300)}

Style requirements:
- Moody space aesthetic with gray fog and cosmic dust
- Deep blacks contrasted with glowing cyan/teal/blue accents  
- Bioluminescent organic elements where appropriate
- Cinematic composition with atmospheric depth
- Painterly texture and careful lighting
- NO text, letters, symbols, or written language anywhere in the image

Atmosphere: Contemplative, haunting, beautiful yet unsettling. Focus on tangible physical details - textures, materials, lighting, forms.

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
