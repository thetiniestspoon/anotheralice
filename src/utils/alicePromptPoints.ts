export interface AlicePromptPoint {
  chapterNumber: number;
  characterPosition: number; // Character index in the chapter text where the dot appears
  textPassage: string;
  description: string;
  id: string; // Unique identifier for this point
}

export const alicePromptPoints: AlicePromptPoint[] = [
  // Chapter 1: THE FIRST ENTRY
  {
    chapterNumber: 1,
    characterPosition: 1650,
    textPassage: "Around him the ship began to reawaken.",
    description: "Interior of a spherical spacecraft coming back to life - control panels flickering with pinprick stars of light in darkness, a lone figure suspended in stillness",
    id: "ch1_ship_reawakens"
  },
  {
    chapterNumber: 1,
    characterPosition: 5820,
    textPassage: "All around, Adam could make them out – smatterings of black ink held fast in the sky, jagged streaks and tears punctuated by circular droplets.",
    description: "Vast gray fog clearing to reveal a stark constellation - intact spherical pods floating alongside tragic columns of debris, dark shapes suspended like musical notes on invisible staffs",
    id: "ch1_debris_field"
  },
  {
    chapterNumber: 1,
    characterPosition: 9150,
    textPassage: "There were streamers and pops of static, light cascading in rivulets across the air in arcs that defied gravity, calligraphy writ in blinding color curly queuing in cursive nonsense all about the cockpit.",
    description: "Explosive descent through dimensions - electric streamers and arcs of colored light writing cursive patterns through a spherical interior, brilliant chaos erupting in all directions",
    id: "ch1_descent"
  },

  // Chapter 2: IN THE GARDENS
  {
    chapterNumber: 2,
    characterPosition: 280,
    textPassage: "The constellations were crammed together in a dazzling dance, turning, rocking, drawing smooth arcs in choreographed pirouettes.",
    description: "View upward to a compressed circle of stars dancing against pitch black - all starlight concentrated in a fist-sized aperture overhead, swirling in elegant choreography",
    id: "ch2_star_circle"
  },
  {
    chapterNumber: 2,
    characterPosition: 2940,
    textPassage: "The gray daffodil, it was hunched over, burying its face in the dust.",
    description: "A single gray daffodil bowing mournfully in dim starlight - petals that hint at yellow caught in eternal grayscale, drooping toward dusty soil",
    id: "ch2_daffodil"
  },
  {
    chapterNumber: 2,
    characterPosition: 4620,
    textPassage: "The bare oak, stood just off-center in the room, positioned near enough to the open porthole so as to be seen while climbing the ladder",
    description: "Dormant gray oak tree standing in circular greenhouse - bare branches reaching toward faint starlight filtering through dome, trunk dark against projected sky",
    id: "ch2_oak_tree"
  },

  // Chapter 3: LIFE OF THE PARTY
  {
    chapterNumber: 3,
    characterPosition: 450,
    textPassage: "The whole of the universe was captured there, compacted into a single, fizzing static circle that punctuated the blank, black sky.",
    description: "Overhead view of compressed universe - all stars compacted into a single bright ring overhead, fizzing and static against void",
    id: "ch3_compressed_stars"
  },
  {
    chapterNumber: 3,
    characterPosition: 1880,
    textPassage: "Their surfaces caught and stretched the neon lines and dancing firelight that illuminated the festivities.",
    description: "Hangar celebration - smooth black spherical pods reflecting neon lights and firelight, disco ball casting geometric light across gathered faces",
    id: "ch3_party"
  },
  {
    chapterNumber: 3,
    characterPosition: 6280,
    textPassage: "It shattered on impact, sending shards of light and glass every way.",
    description: "Disco ball exploding on hangar floor - crystalline fragments scattering across gray faces, squares of bright light breaking into chaos",
    id: "ch3_shattered_ball"
  },

  // Chapter 4: THE BLOOM
  {
    chapterNumber: 4,
    characterPosition: 1820,
    textPassage: "That initial success - a poppy, red in color, that you described as burning and bloody",
    description: "A single vivid red poppy emerging from gray dust - first color in a lifeless world, petals like drops of blood catching starlight",
    id: "ch4_red_poppy"
  },
  {
    chapterNumber: 4,
    characterPosition: 3120,
    textPassage: "ADAM, THE STARS ARE BLOOMING.",
    description: "Stars beginning to fall from their orbital ring - cluster of lights plucked like grapes, plummeting toward the aperture hole in the sky",
    id: "ch4_stars_bloom"
  },
  {
    chapterNumber: 4,
    characterPosition: 5240,
    textPassage: "Mountains rose from the once-flat sea, gargantuan mounds topped by epic monoliths that stretched endlessly upward into all-consuming light.",
    description: "Impossible mountains erupting from gray desert - towering monoliths emerging in blinding light, dust swirling into torrential storm",
    id: "ch4_mountains_rise"
  },

  // Chapter 5: FERTILE GROUND
  {
    chapterNumber: 5,
    characterPosition: 850,
    textPassage: "In his fist were the vestiges of an out-dated experiment, a sad hybrid flower of some sort or another. Its petals were withered and turned inward, their colors swirling in vibrant tie-dye.",
    description: "Withered tie-dye flower blooming underground - petals curled inward, swirling colors wasted in darkness beneath gray dust",
    id: "ch5_underground_flower"
  },
  {
    chapterNumber: 5,
    characterPosition: 4220,
    textPassage: "He could see leaves now, shimmering with a matte charcoal finish that drank in light rather than reflecting it.",
    description: "Obsidian leaves emerging on oak branches - dark matte surfaces drinking starlight, new growth transforming the gray tree",
    id: "ch5_obsidian_leaves"
  },

  // Chapter 6: THE PEARL
  {
    chapterNumber: 6,
    characterPosition: 2340,
    textPassage: "The ochre sac was pulled taut around the man's form, pockets of brown broth nestled in the niches of his joints",
    description: "Figure encased in translucent ochre membrane - form curled like oyster in mud, brown liquid pooling in folds of plastic cocoon",
    id: "ch6_chrysalis"
  },
  {
    chapterNumber: 6,
    characterPosition: 4680,
    textPassage: "Ruby reds and sequin golds, streaks of wavy cerulean wove through the evergreen needles.",
    description: "Artificial Christmas tree illuminated with color - red, gold and blue lights dancing through plastic branches, casting prismed reflections across gray space",
    id: "ch6_tree_lights"
  },

  // Chapter 7: SEARCHING FOR ANOTHER
  {
    chapterNumber: 7,
    characterPosition: 1240,
    textPassage: "I could feel their breathing, slow and peaceful, sleeping beside me in my blindness. I buried my face in their neck.",
    description: "Two figures intertwined in darkness - bodies fitted like puzzle pieces, warmth and breath in absolute blackness before dawn",
    id: "ch7_embrace"
  },
  {
    chapterNumber: 7,
    characterPosition: 2620,
    textPassage: "The rush of light flooded the whole room, bathing me and them alike in pinks and golden orange.",
    description: "Sunrise flooding through parted velvet curtain - waves of pink and golden orange light washing over tangled sleepers",
    id: "ch7_sunrise"
  },

  // Chapter 8: LEAVING THE NEST  
  {
    chapterNumber: 8,
    characterPosition: 1580,
    textPassage: "The pod was tipping forward, its formerly circular profile elongating into an oval and then collapsing further still.",
    description: "Spherical pod deforming and sinking - perfect circle warping into oval as gray dust consumes its lower half",
    id: "ch8_sinking_pod"
  },
  {
    chapterNumber: 8,
    characterPosition: 3240,
    textPassage: "Swaths of obsidian cascaded down the oak's branches, dripping like tar. The leaves unfurled, drinking deep of the dust.",
    description: "Obsidian flowing like dark honey from oak tree - black liquid cascading over branches, leaves unfurling to consume gray dust",
    id: "ch8_obsidian_cascade"
  },

  // Chapter 9: SINK OR SWIM
  {
    chapterNumber: 9,
    characterPosition: 1120,
    textPassage: "All around, the specters of lost souls lingered on leftover belongings laid bare on the floor.",
    description: "Abandoned belongings scattered across curved floor - vials, flasks, bound manuscripts strewn in empty pod interior",
    id: "ch9_abandoned_belongings"
  },
  {
    chapterNumber: 9,
    characterPosition: 3680,
    textPassage: "In his obsidian palm the glass and gold eyepiece resting neatly.",
    description: "Golden eyepiece cradled in dark hand - delicate gold and glass artifact held in black obsidian palm against gray backdrop",
    id: "ch9_eyepiece"
  },

  // Chapter 10: THEIR STORY
  {
    chapterNumber: 10,
    characterPosition: 2840,
    textPassage: "naval oranges - slices floating - atop melted ice",
    description: "Fragmented visions flowing from damaged AI - orange slices suspended in clear liquid, abstract poetry manifesting as surreal imagery",
    id: "ch10_alice_visions"
  },
  {
    chapterNumber: 10,
    characterPosition: 5620,
    textPassage: "A blue-feathered beast, aerodynamic and yet billowing like undulating clouds.",
    description: "Majestic azure creature soaring over emerald hills - impossible bird of blue feathers and fur, calling out resonant question across vibrant dreamscape",
    id: "ch10_blue_creature"
  },

  // Chapter 11: AN ENCOUNTER
  {
    chapterNumber: 11,
    characterPosition: 840,
    textPassage: "The quilted mosaic of stained glass spread across the whole of the vista. It flickered and twinkled in the cascading starlight from above",
    description: "Technicolor valley of living flowers - stained glass landscape of daffodils blooming and decaying in golden rivers, rainbow waves rippling down hills",
    id: "ch11_glass_valley"
  },
  {
    chapterNumber: 11,
    characterPosition: 1680,
    textPassage: "An immense tree like an oak, with a tie-dye trunk of tangerine and turquoise, knotted in massive mighty boughs",
    description: "Colossal oak with swirling tangerine and turquoise bark - massive tree at valley's heart, roots wandering through luminescent glass grass",
    id: "ch11_cosmic_tree"
  },

  // Chapter 12: DEPARTURE
  {
    chapterNumber: 12,
    characterPosition: 780,
    textPassage: "Obsidian cloaked his form, bristling and prickling, swelling in roars like a crowd echoing about a stadium.",
    description: "Figure transformed into flowing obsidian form - black ribbons and helical cape trailing across gray desert, leaving glittering canyons",
    id: "ch12_obsidian_form"
  },
  {
    chapterNumber: 12,
    characterPosition: 1420,
    textPassage: "keep going",
    description: "Lone transformed figure running across infinite gray expanse - obsidian ribbons streaming behind, leaving dark trail toward distant horizon",
    id: "ch12_keep_going"
  },
];