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
      1: "The protagonist Adam enters a black hole in a spherical ship with AI companion ALICE. He finds a graveyard of destroyed ships suspended in gray fog. Themes: isolation, survival, cosmic horror, the unknown.",
      2: "Adam explores his greenhouse of failed botanical experiments aboard the pod. He's a biologist trying to create life in dead environments. Themes: persistence, creation vs destruction, hope despite failure.",
      3: "A massive star storm erupts, forming mountains of cosmic dust. Adam feels impossibly small in the vastness. Themes: overwhelming scale, beauty in chaos, insignificance and awe.",
      4: "Discovery of an egg beginning to hatch in ochre liquid. First signs of nascent life emerging. Themes: birth, vulnerability, potential, anticipation of the new.",
      5: "The garden is destroyed by the storm - daffodils buried, an oak tree inverted. Chaos and loss. Themes: devastation, resilience, nature's fragility and strength.",
      6: "Adam finds an opalescent pearl shifting colors in the dim light. A treasure amid ruins. Themes: discovery, hidden beauty, value in unexpected places.",
      7: "Evan appears and tends to the garden with care, his presence filling the void of loneliness. Themes: companionship, healing touch, shared purpose, end of isolation.",
      8: "Evan tells a story of a house burning to ash at dawn. A past life ending in flames. Themes: destruction, memory, loss, transformation through fire.",
      9: "Adam sinks into the viscous gray dust sea, suspended between life and death. Themes: surrender, liminal space, drowning in the unknown.",
      10: "Adam and Evan stand together at the pod's edge, looking at the horizon. No longer alone but still searching. Themes: partnership, contemplation, shared journey.",
      11: "A mysterious stranger with galaxy-filled eyes speaks with ancient weight. Themes: cosmic perspective, wisdom beyond comprehension, ethereal encounter.",
      12: "The ship awakens, systems coming online. Preparing to leave - not an ending but transformation. Themes: metamorphosis, departure, hope, new beginnings."
    };

    const narrativeContext = chapterContexts[chapterNumber] || "A scene from a sci-fi story about isolation and discovery in space.";

    // Create a rich, context-aware prompt
    const imagePrompt = `Create a cinematic sci-fi illustration for "Another ALICE" - ${narrativeContext}

Key scene from the text: ${textContext.substring(0, 400)}

Visual style: Moody space aesthetic with mysterious gray fog, cosmic dust particles, ethereal bioluminescent lighting, deep blacks contrasted with glowing cyan/teal accents, cinematic composition with dramatic depth of field.

Atmosphere: Contemplative, haunting, beautiful yet unsettling. Capture the loneliness and wonder of deep space exploration, the tension between hope and despair, organic life struggling in mechanical environments.

Technical: Ultra high resolution, painterly details, atmospheric perspective with layers of fog, careful attention to light sources and their glow through the mist.`;

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
