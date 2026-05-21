// ── ANKAHEALFAAZ THEME SYSTEM ──
// 4 cinematic themes. Each engine reads from this.
// Change the theme key — entire experience changes.

var THEMES = {

  // ── THEME 1: ANDHERA (Free) ──
  // Devdas. 3AM. Wet streets. A single streetlight.
  andhera: {
    name: "Andhera",
    tier: "free",
    bg: "#050508",
    bg_gradient_top: "rgba(8,5,5,0.95)",
    bg_gradient_bottom: "rgba(5,5,12,0.98)",

    rain: {
      color_near:  "rgba(180,60,60,{op})",
      color_mid:   "rgba(140,40,40,{op})",
      color_far:   "rgba(100,30,30,{op})",
      lightning:   "rgba(255,220,180,{op})",
      fog:         "rgba(40,10,10,{op})"
    },
    petals: {
      color_a: "rgba(120,30,30,{op})",
      color_b: "rgba(160,50,40,{op})",
      glow:    "rgba(180,60,40,{op})"
    },
    fireflies: {
      core:    "rgba(220,160,60,{op})",
      glow_inner: "rgba(200,140,40,{op})",
      glow_outer: "rgba(150,80,20,0)"
    },
    stars: {
      warm:    "rgba(220,180,100,{op})",
      cool:    "rgba(180,140,80,{op})",
      shoot:   "rgba(255,200,120,{op})",
      milky:   "rgba(200,160,80,{op})"
    }
  },

  // ── THEME 2: SAMUNDAR (Premium) ──
  // Dune. Blade Runner 2049. The edge of a dark infinite ocean.
  samundar: {
    name: "Samundar",
    tier: "premium",
    bg: "#020C12",
    bg_gradient_top: "rgba(2,10,18,0.95)",
    bg_gradient_bottom: "rgba(0,6,12,0.98)",

    rain: {
      color_near:  "rgba(42,191,191,{op})",
      color_mid:   "rgba(20,150,160,{op})",
      color_far:   "rgba(10,100,120,{op})",
      lightning:   "rgba(180,240,255,{op})",
      fog:         "rgba(0,30,40,{op})"
    },
    petals: {
      color_a: "rgba(30,160,180,{op})",
      color_b: "rgba(168,216,218,{op})",
      glow:    "rgba(42,191,191,{op})"
    },
    fireflies: {
      core:       "rgba(168,216,218,{op})",
      glow_inner: "rgba(42,191,191,{op})",
      glow_outer: "rgba(20,120,140,0)"
    },
    stars: {
      warm:  "rgba(168,216,218,{op})",
      cool:  "rgba(100,180,200,{op})",
      shoot: "rgba(200,240,255,{op})",
      milky: "rgba(80,160,180,{op})"
    }
  },

  // ── THEME 3: GULAB (Premium) ──
  // Portrait of a Lady on Fire. A candle in a dark room.
  gulab: {
    name: "Gulab",
    tier: "premium",
    bg: "#080406",
    bg_gradient_top: "rgba(10,4,6,0.95)",
    bg_gradient_bottom: "rgba(6,2,4,0.98)",

    rain: {
      color_near:  "rgba(196,104,122,{op})",
      color_mid:   "rgba(160,70,90,{op})",
      color_far:   "rgba(120,40,60,{op})",
      lightning:   "rgba(255,200,210,{op})",
      fog:         "rgba(40,10,20,{op})"
    },
    petals: {
      color_a: "rgba(160,40,70,{op})",
      color_b: "rgba(232,164,176,{op})",
      glow:    "rgba(196,104,122,{op})"
    },
    fireflies: {
      core:       "rgba(232,164,176,{op})",
      glow_inner: "rgba(196,104,122,{op})",
      glow_outer: "rgba(140,60,80,0)"
    },
    stars: {
      warm:  "rgba(232,164,176,{op})",
      cool:  "rgba(196,104,122,{op})",
      shoot: "rgba(255,200,210,{op})",
      milky: "rgba(180,100,120,{op})"
    }
  },

  // ── THEME 4: PARCHHAIN (Premium) ──
  // Interstellar. Moonlight. Winter silence under a full moon.
  parchhain: {
    name: "Parchhain",
    tier: "premium",
    bg: "#04030A",
    bg_gradient_top: "rgba(4,3,12,0.95)",
    bg_gradient_bottom: "rgba(2,2,8,0.98)",

    rain: {
      color_near:  "rgba(200,190,216,{op})",
      color_mid:   "rgba(160,150,180,{op})",
      color_far:   "rgba(120,110,140,{op})",
      lightning:   "rgba(230,225,255,{op})",
      fog:         "rgba(20,15,30,{op})"
    },
    petals: {
      color_a: "rgba(155,143,176,{op})",
      color_b: "rgba(200,190,216,{op})",
      glow:    "rgba(180,170,200,{op})"
    },
    fireflies: {
      core:       "rgba(200,190,216,{op})",
      glow_inner: "rgba(155,143,176,{op})",
      glow_outer: "rgba(80,70,100,0)"
    },
    stars: {
      warm:  "rgba(200,190,216,{op})",
      cool:  "rgba(155,143,176,{op})",
      shoot: "rgba(230,225,255,{op})",
      milky: "rgba(120,110,145,{op})"
    }
  }
};

// ── THEME HELPER ──
// Replaces {op} placeholder with actual opacity value
function themeColor(template, opacity) {
  return template.replace("{op}", opacity);
}

// ── OCCASION → DEFAULT THEME MAP ──
var occasionTheme = {
  love:       "gulab",
  confession: "andhera",
  birthday:   "gulab",
  apology:    "parchhain",
  friendship: "samundar",
  proposal:   "andhera"
};
