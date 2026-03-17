import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Inject global styles ──────────────────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById("vly-styles")) return;
  const s = document.createElement("style");
  s.id = "vly-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #07040f;
      --surface: rgba(255,255,255,0.04);
      --surface-hover: rgba(255,255,255,0.07);
      --border: rgba(255,255,255,0.08);
      --border-glow: rgba(139,92,246,0.35);
      --purple: #7c3aed;
      --purple-light: #a78bfa;
      --blue: #3b82f6;
      --blue-light: #93c5fd;
      --pink: #ec4899;
      --text: #f0eaff;
      --text-muted: rgba(196,181,253,0.6);
      --text-dim: rgba(196,181,253,0.35);
      --grad: linear-gradient(135deg, #7c3aed, #3b82f6);
      --grad-pink: linear-gradient(135deg, #7c3aed, #ec4899);
      --font-head: 'Bricolage Grotesque', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --radius: 16px;
      --radius-sm: 10px;
      --radius-lg: 24px;
      --shadow: 0 8px 32px rgba(0,0,0,0.4);
      --shadow-glow: 0 8px 32px rgba(124,58,237,0.25);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.6;
      overflow-x: hidden;
      min-height: 100vh;
    }

    #root { min-height: 100vh; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 3px; }

    /* ── Typography ── */
    .g-text {
      background: var(--grad);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .g-text-pink {
      background: var(--grad-pink);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Glass ── */
    .glass {
      background: var(--surface);
      border: 1px solid var(--border);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .glass-glow {
      background: rgba(124,58,237,0.07);
      border: 1px solid var(--border-glow);
      backdrop-filter: blur(12px);
    }

    /* ── Buttons ── */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 11px 22px; border-radius: var(--radius-sm);
      font-family: var(--font-body); font-size: 14px; font-weight: 600;
      cursor: pointer; border: none; transition: all 0.2s; outline: none;
      -webkit-tap-highlight-color: transparent; user-select: none;
    }
    .btn-primary {
      background: var(--grad); color: #fff;
      box-shadow: 0 4px 18px rgba(124,58,237,0.35);
    }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,58,237,0.45); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-ghost {
      background: var(--surface); color: var(--text-muted);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { background: var(--surface-hover); color: var(--text); border-color: rgba(255,255,255,0.14); }

    .btn-copy {
      background: rgba(139,92,246,0.1); color: var(--purple-light);
      border: 1px solid rgba(139,92,246,0.25);
      padding: 6px 12px; font-size: 12px; border-radius: 7px;
      cursor: pointer; font-family: var(--font-body); font-weight: 600;
      transition: all 0.18s; white-space: nowrap;
    }
    .btn-copy:hover { background: rgba(139,92,246,0.2); }
    .btn-copy.copied { background: rgba(16,185,129,0.15); color: #6ee7b7; border-color: rgba(16,185,129,0.3); }

    /* ── Inputs ── */
    input, textarea, select {
      width: 100%; padding: 11px 14px;
      background: rgba(255,255,255,0.05); border: 1px solid var(--border);
      border-radius: var(--radius-sm); color: var(--text);
      font-family: var(--font-body); font-size: 14px;
      outline: none; transition: border-color 0.18s;
      -webkit-appearance: none;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--border-glow); }
    input::placeholder, textarea::placeholder { color: var(--text-dim); }
    textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
    select option { background: #1a1030; color: var(--text); }
    label { display: block; font-size: 12px; font-weight: 600; color: var(--purple-light); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.08em; }

    /* ── Cards ── */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 20px;
      transition: all 0.22s;
    }
    .card:hover { background: var(--surface-hover); border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }

    .result-card {
      background: rgba(255,255,255,0.035);
      border: 1px solid var(--border);
      border-radius: 12px; padding: 14px 16px;
      transition: background 0.18s;
      display: flex; align-items: flex-start; gap: 10px;
    }
    .result-card:hover { background: rgba(255,255,255,0.055); }

    /* ── Animations ── */
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
      50%       { box-shadow: 0 0 40px rgba(124,58,237,0.6); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes orb-drift {
      0%   { transform: translate(0,0) scale(1); }
      33%  { transform: translate(40px,-30px) scale(1.08); }
      66%  { transform: translate(-20px,20px) scale(0.95); }
      100% { transform: translate(0,0) scale(1); }
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .v-fade-up { animation: fade-up 0.55s ease both; }
    .v-d1 { animation-delay: 0.08s; }
    .v-d2 { animation-delay: 0.16s; }
    .v-d3 { animation-delay: 0.24s; }
    .v-d4 { animation-delay: 0.32s; }
    .v-d5 { animation-delay: 0.40s; }

    /* ── Spinner ── */
    .spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite; flex-shrink: 0;
    }

    /* ── Badge ── */
    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 999px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    }
    .badge-ai { background: rgba(124,58,237,0.18); color: #c4b5fd; border: 1px solid rgba(124,58,237,0.3); }
    .badge-yt { background: rgba(239,68,68,0.15); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }
    .badge-ig { background: rgba(236,72,153,0.15); color: #f9a8d4; border: 1px solid rgba(236,72,153,0.3); }
    .badge-hot { background: rgba(251,191,36,0.15); color: #fde68a; border: 1px solid rgba(251,191,36,0.3); }

    /* ── Ad Slot ── */
    .ad-slot {
      background: repeating-linear-gradient(45deg, rgba(255,255,255,0.015), rgba(255,255,255,0.015) 6px, transparent 6px, transparent 12px);
      border: 1px dashed rgba(255,255,255,0.07); border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.15); font-size: 10px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
    }

    /* ── Nav ── */
    .nav-link {
      position: relative; padding: 6px 0; font-size: 14px; font-weight: 500;
      color: var(--text-muted); cursor: pointer; transition: color 0.18s;
      background: none; border: none; font-family: var(--font-body);
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px; background: var(--grad); border-radius: 1px;
      transform: scaleX(0); transition: transform 0.2s;
    }
    .nav-link:hover { color: var(--text); }
    .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
    .nav-link.active { color: var(--text); }

    /* ── Mobile drawer ── */
    .mob-drawer {
      position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 900;
      background: rgba(7,4,15,0.97); backdrop-filter: blur(20px);
      padding: 12px 16px 32px; overflow-y: auto;
      animation: fade-in 0.18s ease both;
    }
    .mob-item {
      display: flex; align-items: center; gap: 10px; width: 100%;
      padding: 14px 16px; border-radius: 12px; border: none;
      background: none; color: var(--text-muted); font-family: var(--font-body);
      font-size: 16px; font-weight: 500; cursor: pointer; text-align: left;
      transition: all 0.18s; -webkit-tap-highlight-color: transparent;
    }
    .mob-item:hover, .mob-item.active { background: rgba(124,58,237,0.12); color: var(--text); }

    /* ── Responsive nav ── */
    .nav-desktop { display: flex; }
    @media(max-width:768px) { .nav-desktop { display: none !important; } }
    .nav-mob-btn { display: none; }
    @media(max-width:768px) { .nav-mob-btn { display: flex !important; } }

    /* ── Section header ── */
    .sec-hdr {
      display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
    }
    .sec-bar { width: 4px; height: 22px; border-radius: 2px; flex-shrink: 0; }

    /* ── Tag chip ── */
    .tag-chip {
      display: inline-flex; align-items: center;
      background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25);
      border-radius: 999px; padding: 4px 12px;
      font-size: 12px; font-weight: 500; color: var(--purple-light);
    }

    /* ── Misc ── */
    @media(max-width:640px) { .sm-hide { display: none !important; } }
    @media(max-width:480px) {
      .xs-p { padding-left: 14px !important; padding-right: 14px !important; }
    }

    /* ── Number badge on results ── */
    .result-num {
      width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: var(--purple-light);
      background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.2);
      margin-top: 2px;
    }

    /* ── Hero gradient ── */
    .hero-grd {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.22) 0%, transparent 60%),
                  radial-gradient(ellipse 50% 40% at 80% 50%, rgba(59,130,246,0.12) 0%, transparent 55%),
                  var(--bg);
    }

    /* Legal pages */
    .legal-content h2 { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: var(--text); margin: 28px 0 8px; }
    .legal-content p, .legal-content li { color: var(--text-muted); font-size: 14px; line-height: 1.75; }
    .legal-content ul { padding-left: 20px; margin: 8px 0; }
    .legal-content a { color: var(--purple-light); }
  `;
  document.head.appendChild(s);
})();

// ─── Routes & constants ────────────────────────────────────────────────────────
const R = {
  HOME:"home", YOUTUBE:"youtube", INSTAGRAM:"instagram",
  ALL:"all", ABOUT:"about", PRIVACY:"privacy", TERMS:"terms",
  CONTACT:"contact", TOOL:"tool",
};

const YT_TOOLS = [
  { id:"yt-title",     icon:"🔥", name:"Title + Thumbnail Generator", desc:"10 viral titles, 5 thumbnail ideas & 5 hook lines",          badge:"yt", popular:true },
  { id:"yt-hook",      icon:"⚡", name:"Hook Generator",               desc:"5–10 scroll-stopping first 5 sec video openers",             badge:"yt" },
  { id:"yt-script",    icon:"📋", name:"Script Idea Generator",        desc:"Full video structure: Intro, Main Points & Outro",           badge:"yt" },
  { id:"yt-ideas",     icon:"💡", name:"Video Idea Generator",         desc:"10 viral video ideas tailored to your niche",                badge:"yt" },
  { id:"yt-thumbnail", icon:"🖼️", name:"Thumbnail Text Generator",    desc:"5–10 bold, click-worthy thumbnail text options",             badge:"yt" },
  { id:"yt-tags",      icon:"🏷️", name:"Tags Generator",              desc:"10–15 SEO-optimised YouTube tags for any topic",             badge:"yt" },
];

const IG_TOOLS = [
  { id:"ig-caption",  icon:"✍️", name:"Caption Generator",           desc:"Engaging, scroll-stopping captions for any post",           badge:"ig", popular:true },
  { id:"ig-hashtag",  icon:"#️⃣", name:"Hashtag Generator",           desc:"3 smart hashtag sets mixing popular & niche tags",          badge:"ig" },
  { id:"ig-bio",      icon:"👤", name:"Bio Generator",               desc:"Magnetic Instagram bios that convert visitors to followers", badge:"ig" },
  { id:"ig-reel",     icon:"🎬", name:"Reel Hook Generator",         desc:"First 3-second hooks that stop the scroll instantly",       badge:"ig" },
  { id:"ig-viral",    icon:"🚀", name:"Viral Idea Generator",        desc:"Data-driven content ideas guaranteed to drive engagement",  badge:"ig" },
];

const ALL_TOOLS = [...YT_TOOLS, ...IG_TOOLS];

// ─── Template engine ───────────────────────────────────────────────────────────
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const range = (n, fn) => Array.from({length:n}, (_, i) => fn(i));

const POWER_WORDS = ["Secret","Hidden","Proven","Shocking","Viral","Ultimate","Insane","Honest","Real","Never-Before-Seen","Fastest","Easiest","Untold","Raw","Brutal"];
const HOOKS_WORDS = ["Nobody talks about","I tested","After 1 year of","The truth about","Why most people fail at","I spent $1000 on","You've been doing wrong"];
const EMOTIONS = ["motivational","witty","relatable","story-driven","conversational","bold","vulnerable"];
const FORMATS = ["Reel","Carousel","Story","Static Post","Live","Collab"];

function genYtTitles(topic, niche) {
  const t = topic || "my niche";
  const n = niche ? ` (${niche})` : "";
  const pw = () => pick(POWER_WORDS);
  const templates = [
    `${pw()} Truth About ${t}${n} Nobody Is Talking About`,
    `I Tried ${t} For 30 Days — Here's What Happened`,
    `The ${pw()} Guide to ${t} in ${new Date().getFullYear()}`,
    `Stop Making These ${t} Mistakes (${pw()} Tips Inside)`,
    `How I Went From 0 to 100K With ${t}${n}`,
    `${pw()} ${t} Hacks That Actually Work`,
    `Why Your ${t} Strategy Is Failing (Fix This Now)`,
    `I Exposed The ${t} Industry — Watch Before This Gets Removed`,
    `${t}: What They Don't Want You To Know${n}`,
    `The Only ${t} Video You'll Ever Need in ${new Date().getFullYear()}`,
    `${pw()} ${t} Tips That Changed Everything For Me`,
    `From Broke to $10K/Month With ${t}${n}`,
  ];
  return shuffle(templates).slice(0, 10);
}

function genYtThumbnails(topic) {
  const t = topic || "the topic";
  return [
    { text: pick(["WAIT—", "STOP!", "NO WAY", "REAL?!", "INSANE"]), detail: `Split face reaction + bold text "${t.toUpperCase()}"` },
    { text: "I WAS WRONG", detail: `Before/after comparison layout with shocked expression` },
    { text: pick(["$0 → $10K", "0 → 1M", "BROKE → RICH"]), detail: `Arrow graphic, bright contrast colours, minimal text` },
    { text: "THIS CHANGED EVERYTHING", detail: `Close-up face, blurred background, high contrast overlay` },
    { text: pick(["SECRET", "HIDDEN", "EXPOSED"]), detail: `Dark moody vibe, neon accent text, mystery element` },
  ];
}

function genYtHooks(topic) {
  const t = topic || "this";
  const hooks = [
    `"You're wasting your time if you haven't tried ${t} yet — but not after this video."`,
    `"I almost didn't make this video… but you deserve to know the truth about ${t}."`,
    `"What if I told you everything you know about ${t} is completely wrong?"`,
    `"In the next 60 seconds, I'm going to show you something that took me 3 years to learn about ${t}."`,
    `"Stop scrolling. If you're struggling with ${t}, this is the only video you need to watch."`,
    `"Most creators skip this one step with ${t} — and it's costing them thousands of views."`,
    `"This ${t} method made me $0 for 6 months… until I changed ONE thing."`,
  ];
  return shuffle(hooks).slice(0, 5);
}

function genYtScriptIdea(topic, niche) {
  const t = topic || "your topic";
  return {
    intro: [
      `Hook: "${pick(["Did you know", "What if I told you", "Here's the brutal truth"])}" — immediately state what viewers will gain.`,
      `Open with a bold claim or surprising statistic about ${t}.`,
      `Show a quick preview of the end result to build anticipation.`,
    ],
    mainPoints: [
      `Point 1 — The Problem: Why most people struggle with ${t} and the #1 mistake they make.`,
      `Point 2 — The Method: Your ${pick(["step-by-step", "proven", "counter-intuitive"])} approach to ${t}. Use a real example.`,
      `Point 3 — The Results: Share data, before/after, or case study. Build credibility.`,
      `Point 4 — The Shortcuts: ${pick(["2–3", "3–5"])} actionable tips viewers can apply TODAY.`,
      `Midroll engagement: Ask viewers to comment their biggest challenge with ${t}.`,
    ],
    outro: [
      `Summarise the key takeaway in ONE sentence.`,
      `CTA: "If this helped, smash the like button — it literally takes 1 second."`,
      `Tease next video: "In my next video, I'll show you how to take ${t} to the next level."`,
      `Subscribe plug: "Join ${pick(["thousands", "hundreds of thousands", "millions"])} of creators — subscribe now."`,
    ],
  };
}

function genYtVideoIdeas(niche) {
  const n = niche || "your niche";
  const ideas = [
    `I Tested Every ${n} Strategy So You Don't Have To — Here Are The Results`,
    `The ${n} Blueprint: How I'd Start From Zero in ${new Date().getFullYear()} (Step-By-Step)`,
    `Reacting to the WORST ${n} Advice on the Internet`,
    `${pick(POWER_WORDS)} ${n} Tools You're Probably Not Using`,
    `I Interviewed 10 Top ${n} Creators — Here's What They All Said`,
    `${n} Myths That Are Costing You Views & Growth`,
    `Day in the Life of a ${n} Creator (Honest & Unfiltered)`,
    `${n} Tier List: Rating Every Strategy From S to F`,
    `$0 vs $100 vs $1000 ${n} Setup — Which Is Actually Worth It?`,
    `The ${n} Video That Changed My Channel Forever`,
    `What 1 Year in ${n} Taught Me (Mistakes, Wins & Lessons)`,
    `${pick(["Controversial opinion:", "Hot take:"])} The Future of ${n} is NOT What You Think`,
  ];
  return shuffle(ideas).slice(0, 10);
}

function genYtThumbnailTexts(topic) {
  const t = (topic || "this").toUpperCase();
  const templates = [
    `${pick(POWER_WORDS).toUpperCase()} ${t}`, `I WAS WRONG ABOUT ${t}`,
    `${t} EXPOSED`, `THIS CHANGED EVERYTHING`, `STOP DOING THIS`,
    `THE TRUTH ABOUT ${t}`, `YOU WON'T BELIEVE THIS`, `GAME CHANGER`,
    `NOBODY TELLS YOU THIS`, `FINALLY — THE ANSWER`, `IT ACTUALLY WORKS`,
    `${t} IN ${new Date().getFullYear()}`, `WATCH BEFORE IT'S GONE`,
  ];
  return shuffle(templates).slice(0, 8);
}

function genYtTags(topic, niche) {
  const t = topic || "content creation";
  const n = niche || "creator";
  const base = [
    t, `${t} tips`, `${t} tutorial`, `${t} ${new Date().getFullYear()}`,
    `how to ${t}`, `${t} for beginners`, `best ${t}`, `${n} ${t}`,
    `${t} guide`, `${t} strategy`, `${t} hacks`, `${t} mistakes`,
    `${n} tips`, `${n} growth`, `viral ${t}`,
  ];
  return shuffle(base).slice(0, 13);
}

// IG generators
function genIgCaptions(topic, niche) {
  const t = topic || "this moment";
  const tone = pick(EMOTIONS);
  const captions = [
    `✨ ${pick(["Real talk:", "Hot take:", "Unpopular opinion:"])} ${t} is the thing nobody talks about — until now. Drop a 💬 if you can relate.\n\n${pick(["#creator", "#reels"])}`,
    `POV: You finally figured out ${t} 🔥\n\nThis one changed everything for me. Save this for later — you'll thank me.\n\n👇 What's YOUR take?`,
    `${t} hit different today. ✨\n\nSometimes you just need to trust the process and keep showing up. Who else is in this season?\n\n💜 Double tap if this is you`,
    `Nobody prepares you for the ${t} era 😅\n\nBut honestly? It's the best thing that's happened to me.\n\nTell me your story below 👇`,
    `3 things ${t} taught me:\n1️⃣ Consistency > perfection\n2️⃣ Your story matters\n3️⃣ Start before you're ready\n\n${pick(["Which hits hardest?", "Save for when you need it.", "Share with someone who needs this."])}`,
  ];
  return shuffle(captions).slice(0, 4);
}

function genIgHashtags(topic) {
  const t = (topic || "content").toLowerCase().replace(/\s+/g, "");
  const sets = [
    `#${t} #${t}tips #${t}community #${t}life #${t}creator #contentcreator #creatortips #growyourinstagram #instagramgrowth #socialmediastrategy`,
    `#${t}goals #${t}motivation #${t}vibes #${t}inspo #${t}daily #instadaily #reelsviral #reelsinstagram #explorepage #instareels`,
    `#${t}niche #${t}brand #${t}journey #${t}success #${t}mindset #smallcreator #creatoreconomy #buildyourbrand #onlinebusiness #passiveincome`,
  ];
  return sets;
}

function genIgBios(niche) {
  const n = niche || "content creator";
  const bios = [
    `✨ ${n} helping you grow online\n🚀 ${pick(["100K+", "50K+", "Helping"])} creators ${pick(["level up", "go viral", "build their brand"])}\n📩 Collab → link below`,
    `${n.charAt(0).toUpperCase()+n.slice(1)} 🎯\nI share what actually works (no fluff)\n${pick(["🔗 Free guide 👇", "💡 New video every week", "📲 DM 'START' to begin"])}`,
    `Turning ${n} into a career 💸\n${pick(["Posting daily ✅", "New content MWF 📅", "Behind the scenes daily 🎬"])}\n👇 My free ${n} toolkit`,
    `${pick(["Hey! I'm", "Hi 👋 I'm"])} your go-to for ${n}\n⚡ Tips that saved me years\n💬 DM me anything, I reply!`,
    `${n} simplified 🧠✨\n${pick(["Made in", "Based in", "Creating from"])} ${pick(["🌍", "🇺🇸", "🌏"])}\n📌 Start here 👇`,
  ];
  return shuffle(bios).slice(0, 4);
}

function genReelHooks(topic) {
  const t = topic || "this";
  const hooks = [
    `"Wait — don't scroll. If you've ever struggled with ${t}, you need to see this."`,
    `"POV: You just discovered the ${t} hack that changes EVERYTHING."`,
    `"I'm about to tell you something about ${t} that took me 3 years to learn in 30 seconds."`,
    `"This ${t} mistake is costing you — and nobody is talking about it."`,
    `"The most common lie about ${t}: that you need to be perfect before you start."`,
    `"If ${t} has been stressing you out, watch this. Right now."`,
    `"I was embarrassed to share this ${t} story… but here we go."`,
  ];
  return shuffle(hooks).slice(0, 5);
}

function genViralIdeas(niche) {
  const n = niche || "your niche";
  const ideas = [
    { format:"Reel", idea:`"A day in the life" as a ${n} creator — raw and unfiltered. Performs 3x better than polished content right now.` },
    { format:"Carousel", idea:`"${pick(["5", "7", "10"])} mistakes I made in ${n} so you don't have to" — save-worthy posts get massive reach.` },
    { format:"Reel", idea:`React to the worst ${n} advice on the internet — controversy + value = algorithm gold.` },
    { format:"Static Post", idea:`Aesthetic quote from a ${n} creator with a hot take in the caption — shareable content builds followers.` },
    { format:"Carousel", idea:`Before/after transformation in ${n} — results-focused posts get 4x the saves.` },
    { format:"Reel", idea:`"What I wish I knew before starting ${n}" — super relatable, huge engagement for new creators.` },
    { format:"Story Series", idea:`Poll your audience on their #1 ${n} struggle — builds engagement AND gives you content ideas.` },
  ];
  return shuffle(ideas).slice(0, 5);
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = useCallback((text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }, []);
  return { copied, copy };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback(msg => {
    const id = Date.now();
    setToasts(t => [...t, {id, msg}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
  }, []);
  return { toasts, show };
}

// ─── Small UI atoms ────────────────────────────────────────────────────────────
function OrbBg() {
  const orbs = [
    { w:500, h:500, top:"-10%", left:"-10%", color:"rgba(124,58,237,0.12)", dur:"20s" },
    { w:400, h:400, top:"30%",  right:"-8%",  color:"rgba(59,130,246,0.1)",  dur:"26s" },
    { w:350, h:350, bottom:"5%",left:"20%",   color:"rgba(236,72,153,0.07)", dur:"18s" },
    { w:300, h:300, top:"60%",  right:"25%",  color:"rgba(124,58,237,0.07)", dur:"22s" },
  ];
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {orbs.map((o,i) => (
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.h,
          top:o.top, left:o.left, right:o.right, bottom:o.bottom,
          background:`radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          borderRadius:"50%",
          animation:`orb-drift ${o.dur} ease-in-out infinite`,
          animationDelay:`${i*3}s`,
          filter:"blur(1px)",
        }}/>
      ))}
      {/* Grid overlay */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
        backgroundSize:"50px 50px",
      }}/>
    </div>
  );
}

function Toast({toasts}) {
  if (!toasts.length) return null;
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)",
          borderRadius:10, padding:"10px 16px", fontSize:13, fontWeight:600,
          color:"#6ee7b7", backdropFilter:"blur(10px)",
          animation:"toast-in 0.3s ease both",
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

function AdSlot({h=80}) {
  return <div className="ad-slot" style={{height:h,margin:"18px 0"}}>Advertisement</div>;
}

function Spinner() { return <div className="spinner"/>; }

function ToolCard({tool, onClick}) {
  const badgeLabel = tool.badge === "yt" ? "YouTube" : "Instagram";
  return (
    <div className="card" style={{cursor:"pointer",position:"relative",overflow:"hidden"}} onClick={() => onClick(tool)}>
      {tool.popular && (
        <div className="badge badge-hot" style={{position:"absolute",top:14,right:14}}>⭐ Popular</div>
      )}
      <div style={{fontSize:28,marginBottom:10}}>{tool.icon}</div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span className={`badge badge-${tool.badge}`}>{badgeLabel}</span>
      </div>
      <h3 style={{fontFamily:"var(--font-head)",fontSize:15,fontWeight:700,marginBottom:5,lineHeight:1.3,paddingRight:tool.popular?60:0}}>{tool.name}</h3>
      <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.55}}>{tool.desc}</p>
      <div style={{marginTop:12,fontSize:12,fontWeight:600,color:"var(--purple-light)",display:"flex",alignItems:"center",gap:4}}>
        Use Tool <span style={{transition:"transform 0.18s"}}>→</span>
      </div>
    </div>
  );
}

function ResultRow({num, text, onCopy, isCopied, delay=0}) {
  return (
    <div className="result-card" style={{animation:`slide-in 0.35s ease ${delay}ms both`}}>
      <div className="result-num">{num}</div>
      <div style={{flex:1,fontSize:14,lineHeight:1.6,wordBreak:"break-word"}}>{text}</div>
      <button className={`btn-copy${isCopied?" copied":""}`} onClick={() => onCopy(text)}>
        {isCopied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

function SectionHdr({title, color="#7c3aed"}) {
  return (
    <div className="sec-hdr">
      <div className="sec-bar" style={{background:color}}/>
      <h3 style={{fontFamily:"var(--font-head)",fontWeight:700,fontSize:16,color:"var(--text)"}}>{title}</h3>
    </div>
  );
}

function ToolHdr({icon, name, desc}) {
  return (
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <div style={{fontSize:28}}>{icon}</div>
        <h2 style={{fontFamily:"var(--font-head)",fontSize:"clamp(20px,4vw,26px)",fontWeight:800}}>{name}</h2>
      </div>
      <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.6}}>{desc}</p>
    </div>
  );
}

function ErrMsg({msg}) {
  if (!msg) return null;
  return (
    <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#fca5a5",marginTop:8}}>
      ⚠️ {msg}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({cur, go}) {
  const [mob, setMob] = useState(false);

  const links = [
    { label:"YouTube", route:R.YOUTUBE },
    { label:"Instagram", route:R.INSTAGRAM },
    { label:"All Tools", route:R.ALL },
    { label:"About", route:R.ABOUT },
  ];

  useEffect(() => {
    setMob(false);
  }, [cur]);

  useEffect(() => {
    const close = () => { if (window.innerWidth > 768) setMob(false); };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 24px",
        background:"rgba(7,4,15,0.8)",
        borderBottom:"1px solid var(--border)",
        backdropFilter:"blur(16px)",
      }}>
        <button onClick={() => go(R.HOME)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:0}}>
          <div style={{
            width:32,height:32,borderRadius:9,
            background:"linear-gradient(135deg,#7c3aed,#3b82f6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"var(--font-head)",fontWeight:800,fontSize:16,color:"#fff",
            boxShadow:"0 4px 14px rgba(124,58,237,0.4)",
          }}>V</div>
          <span style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:18,color:"var(--text)"}}>
            Virlofy
          </span>
        </button>

        <div className="nav-desktop" style={{gap:28}}>
          {links.map(l => (
            <button key={l.route} className={`nav-link${cur===l.route?" active":""}`} onClick={() => go(l.route)}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="btn btn-primary sm-hide" onClick={() => go(R.ALL)} style={{padding:"8px 18px",fontSize:13}}>
            🚀 Get Started
          </button>
          <button className="nav-mob-btn btn btn-ghost" style={{padding:"8px 10px",fontSize:18}} onClick={() => setMob(m => !m)}>
            {mob ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {mob && (
        <div className="mob-drawer" onClick={e => { if (e.target === e.currentTarget) setMob(false); }}>
          {links.map(l => (
            <button key={l.route} className={`mob-item${cur===l.route?" active":""}`} onClick={() => go(l.route)}>
              {l.label}
            </button>
          ))}
          <div style={{height:1,background:"var(--border)",margin:"10px 0"}}/>
          <button className="mob-item" onClick={() => { go(R.ABOUT); setMob(false); }}>About</button>
          <button className="mob-item" onClick={() => { go(R.CONTACT); setMob(false); }}>Contact</button>
          <div style={{padding:"12px 16px"}}>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={() => go(R.ALL)}>
              🚀 Explore All Tools
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer({go, setTool}) {
  const open = t => { setTool(t); go(R.TOOL); };
  return (
    <footer style={{borderTop:"1px solid var(--border)",marginTop:48,padding:"36px 24px 24px"}}>
      <AdSlot h={70}/>
      <div style={{display:"grid",gap:28,gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",marginTop:24,marginBottom:24}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(135deg,#7c3aed,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-head)",fontWeight:800,fontSize:13,color:"#fff"}}>V</div>
            <span style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:15}}>Virlofy</span>
          </div>
          <p style={{fontSize:12,color:"var(--text-dim)",lineHeight:1.7}}>Free AI tools for YouTube & Instagram creators.</p>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"var(--text)"}}>YouTube Tools</div>
          {YT_TOOLS.slice(0,3).map(t => (
            <button key={t.id} onClick={() => open(t)} style={{display:"block",background:"none",border:"none",color:"var(--text-muted)",fontSize:12,padding:"3px 0",cursor:"pointer",textAlign:"left",transition:"color 0.15s",fontFamily:"var(--font-body)"}}>
              {t.name}
            </button>
          ))}
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"var(--text)"}}>Instagram Tools</div>
          {IG_TOOLS.map(t => (
            <button key={t.id} onClick={() => open(t)} style={{display:"block",background:"none",border:"none",color:"var(--text-muted)",fontSize:12,padding:"3px 0",cursor:"pointer",textAlign:"left",transition:"color 0.15s",fontFamily:"var(--font-body)"}}>
              {t.name}
            </button>
          ))}
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"var(--text)"}}>Legal & Info</div>
          {[{l:"About",r:R.ABOUT},{l:"Contact",r:R.CONTACT},{l:"Privacy Policy",r:R.PRIVACY},{l:"Terms & Conditions",r:R.TERMS}].map(x => (
            <button key={x.r} onClick={() => go(x.r)} style={{display:"block",background:"none",border:"none",color:"var(--text-muted)",fontSize:12,padding:"3px 0",cursor:"pointer",textAlign:"left",transition:"color 0.15s",fontFamily:"var(--font-body)"}}>
              {x.l}
            </button>
          ))}
        </div>
      </div>
      <div style={{borderTop:"1px solid var(--border)",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:12,color:"var(--text-dim)"}}>© {new Date().getFullYear()} Virlofy. All rights reserved.</span>
        <span style={{fontSize:12,color:"var(--text-dim)"}}>support@virlofy.com</span>
      </div>
    </footer>
  );
}

// ─── Individual Tool UIs ────────────────────────────────────────────────────────

// YT Title + Thumbnail Generator
function YtTitleTool() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter a video topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => {
      setResult({
        titles: genYtTitles(topic, niche),
        thumbnails: genYtThumbnails(topic),
        hooks: genYtHooks(topic),
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="🔥" name="Title + Thumbnail Generator" desc="Generate 10 viral titles, 5 thumbnail ideas & 5 hook lines for any YouTube video."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Video Topic *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. How I lost 20kg in 90 days" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <div style={{height:12}}/>
        <label>Niche (optional)</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Fitness, Finance, Tech" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "✨ Generate"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>

      {result && (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <AdSlot/>
          <div>
            <SectionHdr title="🔥 Viral Titles (Pick Your Favourite)"/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {result.titles.map((t,i) => (
                <ResultRow key={i} num={i+1} text={t} isCopied={copied===`tt${i}`} onCopy={v=>{copy(v,`tt${i}`);show("Title copied!");}} delay={i*30}/>
              ))}
            </div>
          </div>
          <div>
            <SectionHdr title="🖼️ Thumbnail Concepts" color="#3b82f6"/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {result.thumbnails.map((t,i) => (
                <div key={i} className="result-card" style={{animation:`slide-in 0.35s ease ${i*40}ms both`}}>
                  <div className="result-num">{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:"var(--purple-light)",marginBottom:3}}>"{t.text}"</div>
                    <div style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.5}}>{t.detail}</div>
                  </div>
                  <button className={`btn-copy${copied===`th${i}`?" copied":""}`} onClick={()=>{copy(`"${t.text}" — ${t.detail}`,`th${i}`);show("Copied!");}}>
                    {copied===`th${i}`?"✓":"Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHdr title="🧠 Hook Lines (First 5 Seconds)" color="#10b981"/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {result.hooks.map((h,i) => (
                <ResultRow key={i} num={i+1} text={h} isCopied={copied===`th_h${i}`} onCopy={v=>{copy(v,`th_h${i}`);show("Hook copied!");}} delay={i*35}/>
              ))}
            </div>
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// YT Hook Generator
function YtHookTool() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter a video topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genYtHooks(topic)); setLoading(false); }, 700);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="⚡" name="Hook Generator" desc="Generate 5–7 powerful opening lines that keep viewers glued from the first second."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Video Topic *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Why I quit my 9-5" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "⚡ Generate Hooks"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="⚡ Your Hook Lines"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {result.map((h,i) => (
              <ResultRow key={i} num={i+1} text={h} isCopied={copied===`hk${i}`} onCopy={v=>{copy(v,`hk${i}`);show("Hook copied!");}} delay={i*40}/>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// YT Script Idea Generator
function YtScriptTool() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter a video topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genYtScriptIdea(topic, niche)); setLoading(false); }, 800);
  };

  const Section = ({label, items, color}) => (
    <div>
      <SectionHdr title={label} color={color}/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {items.map((it,i) => (
          <ResultRow key={i} num={i+1} text={it} isCopied={copied===`sc_${label}${i}`} onCopy={v=>{copy(v,`sc_${label}${i}`);show("Copied!");}} delay={i*35}/>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="📋" name="Script Idea Generator" desc="Get a full structured video script outline: intro, key points & outro ideas."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Video Topic *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. How to build a habit that actually sticks"/>
        <div style={{height:12}}/>
        <label>Niche (optional)</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Self-improvement, Productivity"/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "📋 Generate Script"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <Section label="🎬 Intro Ideas" items={result.intro} color="#7c3aed"/>
          <Section label="📌 Main Points" items={result.mainPoints} color="#3b82f6"/>
          <Section label="✅ Outro Ideas" items={result.outro} color="#10b981"/>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// YT Video Idea Generator
function YtIdeasTool() {
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!niche.trim()) { setErr("Please enter your niche."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genYtVideoIdeas(niche)); setLoading(false); }, 700);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="💡" name="Video Idea Generator" desc="Generate 10 viral video ideas tailored to your niche and audience."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Your Niche *</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Personal Finance, Gaming, Cooking" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "💡 Generate Ideas"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 More Ideas</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="💡 Your Video Ideas"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {result.map((v,i) => (
              <ResultRow key={i} num={i+1} text={v} isCopied={copied===`vi${i}`} onCopy={vv=>{copy(vv,`vi${i}`);show("Idea copied!");}} delay={i*30}/>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// YT Thumbnail Text Generator
function YtThumbnailTool() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter your video topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genYtThumbnailTexts(topic)); setLoading(false); }, 600);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="🖼️" name="Thumbnail Text Generator" desc="Get 8+ bold, click-worthy thumbnail text options for maximum CTR."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Video Topic *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. I tried intermittent fasting" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "🖼️ Generate Texts"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="🖼️ Thumbnail Text Options"/>
          <div style={{display:"grid",gap:8,gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))"}}>
            {result.map((t,i) => (
              <div key={i} className="result-card" style={{
                flexDirection:"column",gap:6,cursor:"pointer",
                animation:`fade-up 0.35s ease ${i*40}ms both`,
              }}
                onClick={() => {copy(t,`tx${i}`);show("Copied!");}}>
                <div style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:16,color:"var(--text)",letterSpacing:"0.02em",textAlign:"center",padding:"8px 0"}}>{t}</div>
                <div style={{fontSize:11,color:copied===`tx${i}`?"#6ee7b7":"var(--text-dim)",textAlign:"center",fontWeight:600}}>
                  {copied===`tx${i}`?"✓ Copied!":"Click to copy"}
                </div>
              </div>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// YT Tags Generator
function YtTagsTool() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter a video topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genYtTags(topic, niche)); setLoading(false); }, 600);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="🏷️" name="Tags Generator" desc="Generate 10–15 SEO-optimised YouTube tags to maximise your video discoverability."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Video Topic *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. How to invest in stocks" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <div style={{height:12}}/>
        <label>Niche (optional)</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Personal Finance" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "🏷️ Generate Tags"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
          {result && (
            <button className="btn btn-ghost" onClick={() => {copy(result.join(", "),"all-tags");show(`${result.length} tags copied!`);}}>
              {copied==="all-tags"?"✓ Copied All":"📋 Copy All"}
            </button>
          )}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="🏷️ Your Tags"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            {result.map((t,i) => (
              <button key={i} className="tag-chip" onClick={() => {copy(t,`tg${i}`);show("Tag copied!");}}
                style={{cursor:"pointer",border:"none",transition:"all 0.18s",
                  ...(copied===`tg${i}`?{background:"rgba(16,185,129,0.15)",color:"#6ee7b7",borderColor:"rgba(16,185,129,0.3)"}:{})}}>
                {copied===`tg${i}`?"✓ "+t:"#"+t}
              </button>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// IG Caption Generator
function IgCaptionTool() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please describe your post."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genIgCaptions(topic, niche)); setLoading(false); }, 800);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="✍️" name="Caption Generator" desc="Get 4 unique, engaging Instagram captions for any post topic."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Post Description *</label>
        <textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Morning gym session, back day, feeling strong"/>
        <div style={{height:12}}/>
        <label>Niche (optional)</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Fitness, Lifestyle, Business"/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "✨ Generate Captions"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="✍️ Your Captions" color="#ec4899"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {result.map((c,i) => (
              <ResultRow key={i} num={i+1} text={c} isCopied={copied===`cp${i}`} onCopy={v=>{copy(v,`cp${i}`);show("Caption copied!");}} delay={i*40}/>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// IG Hashtag Generator
function IgHashtagTool() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter your post topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genIgHashtags(topic)); setLoading(false); }, 600);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="#️⃣" name="Hashtag Generator" desc="Get 3 hashtag sets mixing popular, medium & niche tags for maximum reach."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Post Topic / Niche *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Travel photography, sunset" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "#️⃣ Generate Hashtags"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <SectionHdr title="#️⃣ Hashtag Sets" color="#ec4899"/>
          {result.map((set,i) => (
            <div key={i} className="card" style={{animation:`fade-up 0.35s ease ${i*60}ms both`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontWeight:700,fontSize:13,color:"var(--text)"}}>Set {i+1}</span>
                <button className={`btn-copy${copied===`hs${i}`?" copied":""}`} onClick={()=>{copy(set,`hs${i}`);show(`Set ${i+1} copied!`);}}>
                  {copied===`hs${i}`?"✓ Copied":"📋 Copy Set"}
                </button>
              </div>
              <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.8,wordBreak:"break-word"}}>{set}</p>
            </div>
          ))}
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// IG Bio Generator
function IgBioTool() {
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!niche.trim()) { setErr("Please enter your niche."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genIgBios(niche)); setLoading(false); }, 700);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="👤" name="Bio Generator" desc="Create 4 magnetic Instagram bios that convert profile visitors into followers."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Your Niche / What You Do *</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Fitness coach for busy moms" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "👤 Generate Bios"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="👤 Your Instagram Bios" color="#ec4899"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {result.map((b,i) => (
              <ResultRow key={i} num={i+1} text={b} isCopied={copied===`bio${i}`} onCopy={v=>{copy(v,`bio${i}`);show("Bio copied!");}} delay={i*40}/>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// IG Reel Hook Generator
function IgReelTool() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!topic.trim()) { setErr("Please enter your Reel topic."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genReelHooks(topic)); setLoading(false); }, 650);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="🎬" name="Reel Hook Generator" desc="Get 5 scroll-stopping opening lines that keep viewers watching your Reels."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Reel Topic *</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. How I lost 10kg in 3 months" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "🎬 Generate Hooks"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 Regenerate</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="🎬 Your Reel Hooks" color="#ec4899"/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {result.map((h,i) => (
              <ResultRow key={i} num={i+1} text={h} isCopied={copied===`rh${i}`} onCopy={v=>{copy(v,`rh${i}`);show("Hook copied!");}} delay={i*40}/>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// IG Viral Idea Generator
function IgViralTool() {
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { copied, copy } = useCopy();
  const { toasts, show } = useToast();

  const generate = () => {
    if (!niche.trim()) { setErr("Please enter your niche."); return; }
    setErr(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(genViralIdeas(niche)); setLoading(false); }, 700);
  };

  return (
    <div style={{maxWidth:740,margin:"0 auto"}}>
      <Toast toasts={toasts}/>
      <ToolHdr icon="🚀" name="Viral Content Idea Generator" desc="Get 5 data-driven content ideas designed to maximise engagement and reach."/>
      <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"22px 20px 18px",marginBottom:24}}>
        <label>Your Niche / Content Style *</label>
        <input value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Personal finance for Gen Z" onKeyDown={e=>e.key==="Enter"&&generate()}/>
        <ErrMsg msg={err}/>
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><Spinner/>Generating…</> : "🚀 Generate Ideas"}
          </button>
          {result && <button className="btn btn-ghost" onClick={generate}>🔄 More Ideas</button>}
        </div>
      </div>
      {result && (
        <div>
          <SectionHdr title="🚀 Your Viral Ideas" color="#ec4899"/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {result.map((item,i) => (
              <div key={i} className="result-card" style={{animation:`slide-in 0.35s ease ${i*50}ms both`,flexDirection:"column",gap:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className={`badge badge-ig`}>{item.format}</span>
                  <button className={`btn-copy${copied===`vrl${i}`?" copied":""}`} onClick={()=>{copy(item.idea,`vrl${i}`);show("Idea copied!");}}>
                    {copied===`vrl${i}`?"✓":"Copy"}
                  </button>
                </div>
                <p style={{fontSize:14,lineHeight:1.6,color:"var(--text)"}}>{item.idea}</p>
              </div>
            ))}
          </div>
          <AdSlot/>
        </div>
      )}
    </div>
  );
}

// ─── Page: Home ────────────────────────────────────────────────────────────────
function HomePage({go, setTool}) {
  const open = t => { setTool(t); go(R.TOOL); };

  const stats = [
    { n:"11", label:"Free Tools" },
    { n:"100%", label:"No Login" },
    { n:"∞", label:"Generations" },
    { n:"0$", label:"Forever Free" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero-grd" style={{
        minHeight:"100svh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"90px 20px 60px", textAlign:"center", position:"relative",
      }}>
        <div className="v-fade-up" style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)",
          borderRadius:999, padding:"6px 18px", fontSize:12, fontWeight:700,
          color:"var(--purple-light)", marginBottom:20,
        }}>
          <span>✦</span> 11 Free AI Tools for Creators
        </div>

        <h1 className="v-fade-up v-d1" style={{
          fontFamily:"var(--font-head)", fontWeight:800,
          fontSize:"clamp(32px,8vw,80px)", lineHeight:1.04,
          maxWidth:800, marginBottom:18,
        }}>
          Create <span className="g-text">Viral Content</span><br className="sm-hide"/> with Smart Tools
        </h1>

        <p className="v-fade-up v-d2" style={{
          fontSize:"clamp(14px,2.5vw,18px)", color:"var(--text-muted)",
          maxWidth:480, lineHeight:1.75, marginBottom:32,
        }}>
          Free YouTube &amp; Instagram tools for creators who want to grow faster, go viral, and build an audience.
        </p>

        <div className="v-fade-up v-d3" style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
          <button className="btn btn-primary" onClick={() => go(R.ALL)} style={{padding:"14px 28px",fontSize:15,borderRadius:12}}>
            🚀 Explore All Tools
          </button>
          <button className="btn btn-ghost" onClick={() => go(R.YOUTUBE)} style={{padding:"14px 24px",fontSize:15,borderRadius:12}}>
            ▶️ YouTube Tools
          </button>
        </div>

        {/* Stats */}
        <div className="v-fade-up v-d4" style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:1, maxWidth:500, width:"100%",
          background:"var(--border)", borderRadius:"var(--radius)", overflow:"hidden",
        }}>
          {stats.map((s,i) => (
            <div key={i} style={{background:"var(--bg)",padding:"16px 8px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(18px,4vw,26px)",background:"var(--grad)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{s.n}</div>
              <div style={{fontSize:11,color:"var(--text-dim)",fontWeight:500,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured YT */}
      <section style={{padding:"60px 24px",maxWidth:1100,margin:"0 auto"}}>
        <AdSlot/>
        <div style={{textAlign:"center",marginBottom:32,marginTop:12}}>
          <div className="badge badge-yt" style={{marginBottom:10,display:"inline-flex"}}>▶️ YouTube</div>
          <h2 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(22px,4vw,36px)",marginBottom:8}}>
            YouTube <span className="g-text">Creator Tools</span>
          </h2>
          <p style={{color:"var(--text-muted)",fontSize:15,maxWidth:420,margin:"0 auto"}}>Everything you need to grow your channel, free.</p>
        </div>
        <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
          {YT_TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={open}/>)}
        </div>
      </section>

      {/* Featured IG */}
      <section style={{padding:"60px 24px",maxWidth:1100,margin:"0 auto"}}>
        <AdSlot/>
        <div style={{textAlign:"center",marginBottom:32,marginTop:12}}>
          <div className="badge badge-ig" style={{marginBottom:10,display:"inline-flex"}}>📸 Instagram</div>
          <h2 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(22px,4vw,36px)",marginBottom:8}}>
            Instagram <span className="g-text-pink">Growth Tools</span>
          </h2>
          <p style={{color:"var(--text-muted)",fontSize:15,maxWidth:420,margin:"0 auto"}}>Captions, hashtags, bios & viral ideas — all free.</p>
        </div>
        <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
          {IG_TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={open}/>)}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{padding:"40px 24px 60px",maxWidth:860,margin:"0 auto"}}>
        <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"36px 28px",textAlign:"center"}}>
          <h2 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(20px,4vw,32px)",marginBottom:10}}>
            Ready to Go <span className="g-text">Viral</span>?
          </h2>
          <p style={{color:"var(--text-muted)",fontSize:15,marginBottom:24,lineHeight:1.7}}>Join thousands of creators using Virlofy's free tools to grow on YouTube &amp; Instagram.</p>
          <button className="btn btn-primary" onClick={() => go(R.ALL)} style={{padding:"14px 32px",fontSize:15,borderRadius:12,animation:"pulse-glow 3s ease infinite"}}>
            🚀 Start for Free — No Login
          </button>
        </div>
      </section>

      <Footer go={go} setTool={setTool}/>
    </div>
  );
}

// ─── Page: Tool list (YouTube / Instagram / All) ───────────────────────────────
function ToolListPage({go, setTool, mode}) {
  const open = t => { setTool(t); go(R.TOOL); };
  const isYT = mode === "youtube";
  const isIG = mode === "instagram";
  const tools = isYT ? YT_TOOLS : isIG ? IG_TOOLS : ALL_TOOLS;
  const title = isYT ? "YouTube Tools" : isIG ? "Instagram Tools" : "All Tools";
  const sub   = isYT ? "Grow your channel with AI-powered tools" : isIG ? "Level up your Instagram game" : "Every free creator tool in one place";

  return (
    <div style={{padding:"84px 24px 60px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{marginBottom:32,textAlign:"center"}} className="v-fade-up">
        <h1 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(26px,6vw,48px)",marginBottom:8}}>
          {isIG ? <span className="g-text-pink">{title}</span> : <span className="g-text">{title}</span>}
        </h1>
        <p style={{color:"var(--text-muted)",fontSize:15}}>{sub}</p>
      </div>
      <AdSlot/>
      {mode === "all" && (
        <>
          <div style={{marginBottom:24,marginTop:8}}>
            <div className="badge badge-yt" style={{marginBottom:12,display:"inline-flex"}}>▶️ YouTube Tools</div>
            <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
              {YT_TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={open}/>)}
            </div>
          </div>
          <AdSlot/>
          <div>
            <div className="badge badge-ig" style={{marginBottom:12,display:"inline-flex"}}>📸 Instagram Tools</div>
            <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
              {IG_TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={open}/>)}
            </div>
          </div>
        </>
      )}
      {mode !== "all" && (
        <div style={{display:"grid",gap:14,gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))"}}>
          {tools.map(t => <ToolCard key={t.id} tool={t} onClick={open}/>)}
        </div>
      )}
      <AdSlot/>
      <Footer go={go} setTool={setTool}/>
    </div>
  );
}

// ─── Page: Tool ────────────────────────────────────────────────────────────────
const TOOL_MAP = {
  "yt-title":     () => <YtTitleTool/>,
  "yt-hook":      () => <YtHookTool/>,
  "yt-script":    () => <YtScriptTool/>,
  "yt-ideas":     () => <YtIdeasTool/>,
  "yt-thumbnail": () => <YtThumbnailTool/>,
  "yt-tags":      () => <YtTagsTool/>,
  "ig-caption":   () => <IgCaptionTool/>,
  "ig-hashtag":   () => <IgHashtagTool/>,
  "ig-bio":       () => <IgBioTool/>,
  "ig-reel":      () => <IgReelTool/>,
  "ig-viral":     () => <IgViralTool/>,
};

function ToolPage({tool, go, setTool}) {
  const isYT = tool?.badge === "yt";
  const render = TOOL_MAP[tool?.id];
  const back = isYT ? R.YOUTUBE : R.INSTAGRAM;

  return (
    <div style={{padding:"80px 20px 60px",maxWidth:900,margin:"0 auto"}}>
      <button className="btn btn-ghost" onClick={() => go(back)} style={{marginBottom:24,padding:"8px 14px",fontSize:13,gap:6}}>
        ← Back to {isYT ? "YouTube" : "Instagram"} Tools
      </button>
      {render ? render() : <p style={{color:"var(--text-muted)"}}>Tool not found.</p>}
      <div style={{maxWidth:740,margin:"20px auto 0"}}>
        <Footer go={go} setTool={setTool}/>
      </div>
    </div>
  );
}

// ─── Page: About ───────────────────────────────────────────────────────────────
function AboutPage({go, setTool}) {
  const items = [
    { icon:"🎯", title:"Our Mission", text:"Virlofy democratises content creation. Every creator — regardless of budget — deserves powerful tools to grow, go viral, and build a real audience. We built exactly that." },
    { icon:"🆓", title:"100% Free, Forever", text:"Every single tool is completely free. No login, no subscription, no paywall. We're sustained by non-intrusive ads so you can focus entirely on creating." },
    { icon:"⚡", title:"Smart Templates", text:"Our tools use advanced randomised templates built from studying thousands of viral videos and posts. Every output is unique — no two results are the same." },
    { icon:"🔒", title:"Privacy First", text:"We don't collect your data, require accounts, or store your inputs. Your creative process stays 100% private — always." },
    { icon:"📈", title:"Built for Growth", text:"Whether you're a new creator or a seasoned pro, Virlofy's tools are engineered to help you save time, create better content, and grow faster." },
  ];

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"84px 20px 60px"}}>
      <div className="v-fade-up" style={{textAlign:"center",marginBottom:36}}>
        <div style={{width:64,height:64,borderRadius:17,margin:"0 auto 14px",background:"linear-gradient(135deg,#7c3aed,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-head)",fontWeight:800,fontSize:26,color:"#fff",boxShadow:"var(--shadow-glow)"}}>V</div>
        <h1 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(26px,6vw,44px)",marginBottom:6}}>
          About <span className="g-text">Virlofy</span>
        </h1>
        <p style={{color:"var(--text-muted)",fontSize:15,fontStyle:"italic"}}>Free Tools to Grow on YouTube &amp; Instagram</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {items.map((it,i) => (
          <div key={i} className={`glass v-fade-up v-d${Math.min(i+1,5)}`} style={{borderRadius:"var(--radius)",padding:"18px 18px",display:"flex",gap:14}}>
            <div style={{fontSize:24,flexShrink:0,marginTop:2}}>{it.icon}</div>
            <div>
              <h3 style={{fontFamily:"var(--font-head)",fontWeight:700,fontSize:15,marginBottom:5}}>{it.title}</h3>
              <p style={{color:"var(--text-muted)",fontSize:13.5,lineHeight:1.7}}>{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:36}}>
        <button className="btn btn-primary" onClick={() => go(R.ALL)} style={{padding:"13px 32px",fontSize:15,borderRadius:12}}>
          🚀 Start Using Tools
        </button>
      </div>
      <Footer go={go} setTool={setTool}/>
    </div>
  );
}

// ─── Page: Privacy Policy ──────────────────────────────────────────────────────
function PrivacyPage({go, setTool}) {
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"84px 20px 60px"}} className="legal-content">
      <h1 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(24px,5vw,40px)",marginBottom:4}}>Privacy <span className="g-text">Policy</span></h1>
      <p style={{color:"var(--text-dim)",fontSize:13,marginBottom:28}}>Last updated: {new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</p>

      <h2>1. Information We Collect</h2>
      <p>Virlofy does not collect any personally identifiable information. We do not require you to create an account, log in, or provide any personal details to use our tools.</p>
      <p>We may collect non-personal, aggregated data such as page views and usage statistics through analytics services (e.g., Google Analytics) to improve our platform.</p>

      <h2>2. Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li>Analytics cookies to understand how visitors use our site</li>
        <li>Advertising cookies used by third-party ad networks (e.g., Google AdSense)</li>
        <li>Functional cookies to remember your preferences</li>
      </ul>
      <p>You can control cookie settings through your browser. Disabling cookies may affect ad personalisation.</p>

      <h2>3. Third-Party Advertising</h2>
      <p>Virlofy is supported by advertising. We use third-party advertising services (e.g., Google AdSense) that may use cookies and web beacons to serve personalised ads based on your browsing history. These companies operate under their own privacy policies.</p>
      <p>You can opt out of personalised advertising at <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">aboutads.info</a>.</p>

      <h2>4. User Inputs</h2>
      <p>Text you enter into our tools (topics, niches, etc.) is processed entirely in your browser. We do not store, transmit, or share any content you enter into Virlofy's tools.</p>

      <h2>5. Data Security</h2>
      <p>Since we do not collect or store personal data, there is no risk of your personal information being compromised through our platform.</p>

      <h2>6. Children's Privacy</h2>
      <p>Virlofy is not directed at children under the age of 13. We do not knowingly collect information from children.</p>

      <h2>7. Changes to This Policy</h2>
      <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

      <h2>8. Contact</h2>
      <p>Questions about this policy? Contact us at <a href="mailto:support@virlofy.com">support@virlofy.com</a>.</p>
      <Footer go={go} setTool={setTool}/>
    </div>
  );
}

// ─── Page: Terms ───────────────────────────────────────────────────────────────
function TermsPage({go, setTool}) {
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"84px 20px 60px"}} className="legal-content">
      <h1 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(24px,5vw,40px)",marginBottom:4}}>Terms &amp; <span className="g-text">Conditions</span></h1>
      <p style={{color:"var(--text-dim)",fontSize:13,marginBottom:28}}>Last updated: {new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Virlofy, you agree to these Terms &amp; Conditions. If you do not agree, please do not use the platform.</p>

      <h2>2. Free Use of Tools</h2>
      <p>All tools on Virlofy are provided free of charge. You may use the tools for personal and commercial content creation purposes. You may not resell, redistribute, or claim ownership over Virlofy's tool system itself.</p>

      <h2>3. Content Responsibility</h2>
      <p>The content generated by our tools is based on templates and randomisation. You are solely responsible for reviewing and editing generated content before publishing. Virlofy takes no responsibility for how generated content is used.</p>

      <h2>4. No Warranty</h2>
      <p>Virlofy tools are provided "as is" without warranties of any kind. We do not guarantee that tool outputs will be accurate, viral, or suitable for any specific purpose.</p>

      <h2>5. Limitation of Liability</h2>
      <p>Virlofy shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform, including but not limited to loss of revenue, data, or business opportunities.</p>

      <h2>6. Right to Modify</h2>
      <p>We reserve the right to modify, add, remove, or restrict access to any tool or feature at any time without prior notice.</p>

      <h2>7. Intellectual Property</h2>
      <p>The Virlofy brand, design, and tool infrastructure are owned by Virlofy. Generated outputs belong to the user who generated them.</p>

      <h2>8. Advertising</h2>
      <p>Virlofy displays advertisements to sustain the free service. You agree not to use ad blockers in a way that interferes with the platform's ability to display ads.</p>

      <h2>9. Contact</h2>
      <p>Questions? Reach us at <a href="mailto:support@virlofy.com">support@virlofy.com</a>.</p>

      <Footer go={go} setTool={setTool}/>
    </div>
  );
}

// ─── Page: Contact ─────────────────────────────────────────────────────────────
function ContactPage({go, setTool}) {
  const [form, setForm] = useState({name:"",email:"",msg:""});
  const [sent, setSent] = useState(false);

  const submit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.msg.trim()) return;
    setSent(true);
  };

  const F = ({label,type="text",field,rows}) => (
    <div style={{marginBottom:16}}>
      <label>{label}</label>
      {rows ? (
        <textarea rows={rows} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}/>
      ) : (
        <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}/>
      )}
    </div>
  );

  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"84px 20px 60px"}}>
      <div className="v-fade-up" style={{textAlign:"center",marginBottom:32}}>
        <h1 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"clamp(26px,6vw,44px)",marginBottom:6}}>
          Get in <span className="g-text">Touch</span>
        </h1>
        <p style={{color:"var(--text-muted)",fontSize:15}}>Questions, feedback, or collab? We'd love to hear from you.</p>
      </div>

      {!sent ? (
        <form onSubmit={submit} className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"24px 22px"}}>
          <F label="Name *" field="name"/>
          <F label="Email *" type="email" field="email"/>
          <F label="Message *" field="msg" rows={5}/>
          <button type="submit" className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"13px",borderRadius:12,fontSize:15}}>
            ✉️ Send Message
          </button>
          <p style={{textAlign:"center",fontSize:12,color:"var(--text-dim)",marginTop:12}}>
            Or email us directly: <a href="mailto:support@virlofy.com" style={{color:"var(--purple-light)"}}>support@virlofy.com</a>
          </p>
        </form>
      ) : (
        <div className="glass-glow" style={{borderRadius:"var(--radius-lg)",padding:"36px 24px",textAlign:"center",animation:"fade-up 0.4s ease both"}}>
          <div style={{fontSize:48,marginBottom:12}}>✅</div>
          <h2 style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:22,marginBottom:8}}>Message Sent!</h2>
          <p style={{color:"var(--text-muted)",fontSize:14,lineHeight:1.7}}>Thanks for reaching out. We typically reply within 24–48 hours at <strong>support@virlofy.com</strong></p>
          <button className="btn btn-ghost" style={{marginTop:20}} onClick={() => setSent(false)}>Send Another</button>
        </div>
      )}

      <Footer go={go} setTool={setTool}/>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState(R.HOME);
  const [tool, setTool]   = useState(null);

  const go = useCallback(r => {
    setRoute(r);
    window.scrollTo({top:0, behavior:"smooth"});
  }, []);

  const pages = {
    [R.HOME]:      <HomePage      go={go} setTool={setTool}/>,
    [R.YOUTUBE]:   <ToolListPage  go={go} setTool={setTool} mode="youtube"/>,
    [R.INSTAGRAM]: <ToolListPage  go={go} setTool={setTool} mode="instagram"/>,
    [R.ALL]:       <ToolListPage  go={go} setTool={setTool} mode="all"/>,
    [R.ABOUT]:     <AboutPage     go={go} setTool={setTool}/>,
    [R.PRIVACY]:   <PrivacyPage   go={go} setTool={setTool}/>,
    [R.TERMS]:     <TermsPage     go={go} setTool={setTool}/>,
    [R.CONTACT]:   <ContactPage   go={go} setTool={setTool}/>,
    [R.TOOL]:      <ToolPage      tool={tool} go={go} setTool={setTool}/>,
  };

  return (
    <div style={{position:"relative",minHeight:"100vh",overflowX:"hidden"}}>
      <OrbBg/>
      <div style={{position:"relative",zIndex:1}}>
        <Navbar cur={route} go={go}/>
        {pages[route] || pages[R.HOME]}
      </div>
    </div>
  );
}
