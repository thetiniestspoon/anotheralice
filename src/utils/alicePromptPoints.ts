export interface AlicePromptPoint {
  chapterNumber: number;
  characterPosition: number; // Character index in the chapter text where the dot appears
  textPassage: string;
  description: string;
  id: string; // Unique identifier for this point
}

export const alicePromptPoints: AlicePromptPoint[] = [
  // Chapter 1 - Entry into the unknown
  {
    chapterNumber: 1,
    characterPosition: 1200,
    textPassage: "The appalling silence of deep space crescendoed recklessly to a roar, then a scream, then an awesome symphony of sound and static.",
    description: "A visual explosion of sound waves transforming from silence into chaos - vibrating energy patterns, crescendoing waveforms bursting into color, sonic ripples through the void of space",
    id: "ch1-entry"
  },
  {
    chapterNumber: 1,
    characterPosition: 5800,
    textPassage: "His entire body felt like it was covered in a swarm of bees, their wings beating relentlessly at the air.",
    description: "A silhouette of a figure surrounded by glowing particles like a cloud of luminous bees - golden points of light vibrating and pulsing around the body, creating a halo of energy",
    id: "ch1-bees"
  },
  {
    chapterNumber: 1,
    characterPosition: 8900,
    textPassage: "Adam rubbed at his eyes in disbelief, as the dancing gray fog shifted, revealing a dramatic constellation of ships and debris.",
    description: "A haunting field of broken spacecraft suspended in thick gray fog - intact spherical pods floating among jagged torn metal sheets, dark silhouettes against swirling mist, debris creating an eerie constellation pattern",
    id: "ch1-constellation"
  },

  // Chapter 2 - Gardens of failure and hope
  {
    chapterNumber: 2,
    characterPosition: 1500,
    textPassage: "The vegetation consisted of meager, naked, weary excuses for life.",
    description: "A dimly lit greenhouse filled with wilting plants in terracotta pots - withered stems without leaves, exposed roots tangled in dry soil, failed seedlings turning to dust, rows of dying attempts at cultivation",
    id: "ch2-greenhouse"
  },
  {
    chapterNumber: 2,
    characterPosition: 3400,
    textPassage: "A single daffodil bloomed defiantly among the failures.",
    description: "One brilliant golden daffodil flower glowing softly in darkness - luminescent petals radiating warm light, surrounded by shadows and dead plant matter, a solitary beacon of successful life",
    id: "ch2-daffodil"
  },
  {
    chapterNumber: 2,
    characterPosition: 5200,
    textPassage: "Yellow petals catching what little light filtered through the pod's porthole.",
    description: "Rays of dim light streaming through a circular porthole, illuminating golden daffodil petals - soft beams cutting through darkness to spotlight living color against cold metal walls",
    id: "ch2-light"
  },

  // Chapter 3 - The cosmic storm
  {
    chapterNumber: 3,
    characterPosition: 2100,
    textPassage: "The swirling gray expanse began to rise and buckle, forming monumental shapes.",
    description: "Enormous waves of cosmic dust rising and cresting like ocean swells - gray matter forming towering walls and cascading peaks, frozen in moment before collapse",
    id: "ch3-rising"
  },
  {
    chapterNumber: 3,
    characterPosition: 3600,
    textPassage: "Mountains rose from the once-flat sea, gargantuan mounds topped by epic monoliths.",
    description: "Towering mountains of cosmic dust rising from a gray sea - massive angular formations reaching upward, illuminated by intense light from above, deep valleys between monuments creating dramatic shadows",
    id: "ch3-mountains"
  },

  // Chapter 4 - Birth and emergence
  {
    chapterNumber: 4,
    characterPosition: 2800,
    textPassage: "There waited an egg, partially submerged in a pool of ochre soup.",
    description: "A pale organic egg floating in thick amber liquid - smooth shell surface with a hairline crack spiraling around its circumference, murky golden broth gently rippling, dim chamber lighting",
    id: "ch4-egg"
  },
  {
    chapterNumber: 4,
    characterPosition: 4500,
    textPassage: "The crack widened and a pale appendage emerged.",
    description: "A translucent appendage pushing through cracked eggshell - delicate pale limb testing the air, fragments of shell falling into ochre liquid below, moment of emergence frozen in time",
    id: "ch4-hatching"
  },
  {
    chapterNumber: 4,
    characterPosition: 6200,
    textPassage: "Obsidian skin glistening wet in the low amber light.",
    description: "Dark iridescent skin catching light - wet obsidian surface reflecting amber glow, liquid droplets catching illumination like scattered jewels on black glass",
    id: "ch4-obsidian"
  },

  // Chapter 5 - Destruction and survival
  {
    chapterNumber: 5,
    characterPosition: 1800,
    textPassage: "The greenhouse shattered, pottery and soil raining through the pod.",
    description: "An explosion of terracotta fragments suspended mid-air - broken pottery pieces spinning and tumbling, dark soil cascading like waterfalls, plants torn from their containers floating through chaos",
    id: "ch5-shatter"
  },
  {
    chapterNumber: 5,
    characterPosition: 3500,
    textPassage: "The faces of daffodils peeked out from behind shattered clay pieces.",
    description: "Yellow daffodil flowers buried under broken pottery shards and dust hills - golden petals struggling through debris, an upside-down oak tree with roots exposed to air and branches buried in chaos",
    id: "ch5-destruction"
  },

  // Chapter 6 - The pearl's promise
  {
    chapterNumber: 6,
    characterPosition: 2600,
    textPassage: "Something round and luminous rested in the debris.",
    description: "A glowing spherical pearl nestled among wreckage - opalescent surface catching faint light, surrounded by dark broken fragments, emanating subtle inner radiance",
    id: "ch6-discovery"
  },
  {
    chapterNumber: 6,
    characterPosition: 4400,
    textPassage: "The pearl gleamed in the low light, shifting colors as it caught illumination.",
    description: "An iridescent pearl held in cupped hands - opalescent surface shifting between blue, green, and purple hues, catching rays of dim light, colors dancing across the smooth spherical surface like oil on water",
    id: "ch6-pearl"
  },

  // Chapter 7 - Connection and companionship
  {
    chapterNumber: 7,
    characterPosition: 2400,
    textPassage: "Two figures moving through the greenhouse together.",
    description: "Silhouettes of two people working side by side among plants - backlit figures tending to vegetation, their shadows merging and separating as they move through rows of seedlings",
    id: "ch7-together"
  },
  {
    chapterNumber: 7,
    characterPosition: 4100,
    textPassage: "Hands running along stems and leaves, checking each plant carefully.",
    description: "Gentle hands tending to plant stems in a greenhouse - fingers carefully examining leaves and stems, checking for signs of health, tender care being given to growing vegetation in dim light",
    id: "ch7-care"
  },
  {
    chapterNumber: 7,
    characterPosition: 6200,
    textPassage: "Their hands touched as they reached for the same stem.",
    description: "Two hands meeting on a single plant stem - fingers touching as they both reach for the same green shoot, moment of connection among the plants, gentle overlap of reaching gestures",
    id: "ch7-connection"
  },

  // Chapter 8 - Fire and transformation
  {
    chapterNumber: 8,
    characterPosition: 2200,
    textPassage: "Flames licked at the edges of the pod's interior.",
    description: "Fire spreading across metal surfaces - orange and yellow flames dancing along curved walls, smoke rising and curling in enclosed space, heat distorting the air",
    id: "ch8-flames"
  },
  {
    chapterNumber: 8,
    characterPosition: 4000,
    textPassage: "With a momentous crash, a life crumbled to ash in twilit breaths of dawn.",
    description: "A structure collapsing into flames at dawn - building silhouette disintegrating into ash and embers, twilight sky with first light breaking, debris falling through smoke and fire",
    id: "ch8-collapse"
  },

  // Chapter 9 - Submersion and survival
  {
    chapterNumber: 9,
    characterPosition: 1900,
    textPassage: "The dust sea rose to swallow the pod entirely.",
    description: "Cosmic dust flooding into a spherical vessel - gray matter flowing like liquid through porthole and seams, filling interior space, engulfing everything in its path",
    id: "ch9-flood"
  },
  {
    chapterNumber: 9,
    characterPosition: 3200,
    textPassage: "Floating in the viscous gray, suspended between drowning and breathing.",
    description: "A figure suspended in thick gray liquid - weightless body floating in viscous fog-like fluid, neither sinking nor rising, caught in liminal space between substance and void",
    id: "ch9-suspended"
  },
  {
    chapterNumber: 9,
    characterPosition: 4800,
    textPassage: "The obsidian skin held the dust at bay, creating a protective barrier.",
    description: "Dark iridescent membrane shielding a body - obsidian coating repelling gray particles, creating a clear bubble of space within the murky flood, protective layer glistening",
    id: "ch9-protection"
  },

  // Chapter 10 - Journey together
  {
    chapterNumber: 10,
    characterPosition: 2700,
    textPassage: "They moved across the dust sea on a makeshift platform.",
    description: "Two figures on a floating platform drifting across gray expanse - makeshift raft gliding over cosmic dust, leaving wake patterns behind, travelers silhouetted against vast emptiness",
    id: "ch10-journey"
  },
  {
    chapterNumber: 10,
    characterPosition: 4800,
    textPassage: "They stood together at the edge, looking out at the horizon.",
    description: "Two silhouettes standing at the edge of a platform - figures side by side looking toward a gray horizon where dust meets sky, vastness stretching before them, shared contemplation",
    id: "ch10-threshold"
  },
  {
    chapterNumber: 10,
    characterPosition: 6400,
    textPassage: "The ring of stars above turned slowly, a cosmic clock marking their passage.",
    description: "A circular constellation rotating overhead - stars arranged in perfect ring formation slowly spinning, celestial timepiece against dark void, light tracing orbital paths",
    id: "ch10-stars"
  },

  // Chapter 11 - The stranger
  {
    chapterNumber: 11,
    characterPosition: 2100,
    textPassage: "A figure appeared on the horizon, walking toward him through the dust.",
    description: "A lone silhouette approaching across gray plains - distant figure moving with purpose through cosmic dust, form growing clearer with each step, mysterious arrival from beyond",
    id: "ch11-approach"
  },
  {
    chapterNumber: 11,
    characterPosition: 3800,
    textPassage: "Eyes held galaxies within them, reflecting the dancing stars above.",
    description: "Close view of eyes filled with starlight - pupils containing swirling galaxies, stars reflected in the iris, cosmic patterns dancing within the gaze, deep space contained in human eyes",
    id: "ch11-eyes"
  },
  {
    chapterNumber: 11,
    characterPosition: 5200,
    textPassage: "The stranger's form shimmered and shifted, neither fully present nor absent.",
    description: "A figure flickering between states of being - body alternating between solid and translucent, edges blurring and sharpening, existing in multiple forms simultaneously",
    id: "ch11-shimmer"
  },

  // Chapter 12 - Departure and new beginning
  {
    chapterNumber: 12,
    characterPosition: 2800,
    textPassage: "Running alone across the endless gray, finding rhythm in the solitude.",
    description: "A lone runner moving across vast dust plains - figure in motion creating wake patterns, steady pace across infinite gray expanse, solitary journey through emptiness",
    id: "ch12-running"
  },
  {
    chapterNumber: 12,
    characterPosition: 4600,
    textPassage: "The ship trembled with anticipation, systems coming online one by one.",
    description: "A spherical spacecraft awakening - control panels lighting up in sequence, energy flowing through the ship's systems, gentle vibration of machinery coming to life, glow of activation spreading across surfaces",
    id: "ch12-awakening"
  },
  {
    chapterNumber: 12,
    characterPosition: 6800,
    textPassage: "The ship rose from the dust, leaving everything behind, moving toward the light.",
    description: "A spherical vessel ascending from gray surface - craft lifting off and accelerating upward, dust cascading off its hull, moving toward brilliant ring of stars above",
    id: "ch12-ascension"
  }
];