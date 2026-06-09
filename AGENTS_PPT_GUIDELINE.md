# AI Agent Presentation Platform Guideline

This document defines how to create new slide decks, customize themes, and implement custom transitions using the shared presentation engine in this repository.

---

## 1. Directory Structure

```text
├── index.html                  # Main portal home page (lists all presentations)
├── shared/
│   ├── css/
│   │   └── deck-core.css       # Core structural layout & default animations
│   └── js/
│       └── deck-core.js        # Core presentation engine (rendering & controls)
├── harness-and-workflows/
│   └── index.html              # Presentation 1 (Harness & Workflows theme)
└── [new-deck-folder]/
    └── index.html              # New Presentation
```

---

## 2. Template for a New Presentation

To build a new slide deck, create a directory (e.g., `my-new-deck/`) containing an `index.html` file using this structure:

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Presentation Title · Academic Report</title>
<!-- 1. Load Shared Structural Styles -->
<link rel="stylesheet" href="../shared/css/deck-core.css">

<!-- 2. Customize Theme and Transitions -->
<style>
  :root {
    /* Color Palette */
    --bg: #0d0e15;
    --bg2: #151828;
    --panel: #1e2238;
    --ink: #f0f2fa;
    --muted: #a0a6cc;
    --line: #2e3456;
    --accent: #ff7ebb;      /* Warm Pink Accent */
    --accent2: #a27aff;     /* Violet Secondary */
    --gold: #f5c451;
    --serif: "Noto Serif TC", serif;
    --sans: "Noto Sans TC", sans-serif;

    /* Custom Transitions Override */
    --slide-in-animation: customZoomIn 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    --bullet-in-animation: customSlideFromLeft 0.5s ease forwards;
  }

  /* Custom Page Layouts / Backgrounds */
  .slide.cover {
    justify-content: center;
    align-items: flex-start;
    background: radial-gradient(1000px 500px at 90% 10%, rgba(255,126,187,0.1), transparent), var(--bg);
  }

  /* Define Custom Animation Keyframes */
  @keyframes customZoomIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes customSlideFromLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
</style>
</head>
<body>
<!-- Core HTML Structure Required by deck-core -->
<div id="brand">Header Title Text</div>
<div id="deck"></div>
<div id="bar"></div>
<div id="hud">
  <button class="navbtn" id="prev" title="Previous (←)">‹</button>
  <span class="count"><span id="cur">1</span> / <span id="total">1</span></span>
  <button class="navbtn" id="next" title="Next (→)">›</button>
</div>
<div id="help">← → Flip · <kbd>F</kbd> Fullscreen · <kbd>N</kbd> Notes · <kbd>O</kbd> Overview</div>

<!-- 3. Configure Presentation Data -->
<script>
const DATA = {
  reportTitle: "Presentation Main Title",
  subtitle: "Optional Subtitle",
  categoryTag: "分類標籤 · Subtitle Tag",
  metaInfo: "Author / Meta / Source Details",
  slides: [
    {
      type: "cover",
      title: "My Slide Deck Title",
      subtitle: "Presentation Subtitle",
      body: "Brief introductory paragraph.",
      note: "Speaker notes visible when pressing N."
    },
    {
      type: "content",
      title: "Main Header",
      body: "Content paragraph text explaining the concepts.",
      bullets: [
        "First point with <b>bold highlighting</b>",
        "Second bullet item",
        "Third bullet item"
      ]
    },
    {
      type: "section",
      title: "Chapter 1: The Transition",
      num: "01"
    }
  ]
};
</script>

<!-- 4. Load Core Presentation Engine Script -->
<script src="../shared/js/deck-core.js"></script>
</body>
</html>
```

---

## 3. Designing Custom Styles and Colors

Colors and fonts are mapped through CSS Custom Properties (Variables). Redefine them inside the `<style>` block:

| Variable | Usage / Target Component | Default Value |
| :--- | :--- | :--- |
| `--bg` | Main workspace background color | `#0c1320` |
| `--bg2` | Secondary background / Section transitions | `#111c2e` |
| `--panel` | Navigation HUD background | `#16233a` |
| `--ink` | Primary text font color | `#eef3fb` |
| `--muted` | Secondary or helper text color | `#9fb2cc` |
| `--line` | Borders and divider lines | `#26384f` |
| `--accent` | Primary accent color (Kickers, tags, bullet points) | `#5ad1c4` |
| `--accent2` | Secondary accent (Subtitles, HUD hover effects) | `#7aa2ff` |
| `--gold` | Warning tags or bold highlight text | `#f5c451` |
| `--serif` | Font family for headings | `"Noto Serif TC", serif` |
| `--sans` | Font family for body content | `"Noto Sans TC", sans-serif` |

---

## 4. Customizing Animations

To override default animations, re-assign these core animation properties:

### Slide Transition
Controlled by `--slide-in-animation`.
*   **Default**: `coreFade .55s ease`
*   **Customization**: Define your custom `@keyframes` in the local stylesheet and assign it:
    ```css
    --slide-in-animation: mySlideUp 0.6s ease;
    ```

### Bullet point Delay & Entrance
Controlled by `--bullet-in-animation`.
*   **Default**: `coreSlideIn .45s ease forwards`
*   **Delay steps** can be configured using:
    *   `--bullet-delay-base`: Base start delay (default: `0.15s`)
    *   `--bullet-delay-step`: Incremental delay per bullet (default: `0.08s`)

---

## 5. Slide Types & Templates
The `deck-core.js` engine reads the `type` parameter of each slide to render specific markup styles:

1.  `cover`: Intended for the title slide. Includes title, subtitle, main body, category tag, and meta information.
2.  `section`: Chapter divider slides. Displayed with a large step number (`num`) and title.
3.  `toc`: Table of contents.
4.  `content` / Default: Typical content layout with kickers, title, body paragraph, bullet points, and speaker notes.
5.  `comparison`: Styled for side-by-side or comparison lists.
6.  `conclusion`: Ending wrap-ups.
7.  `references`: Citation listings.

---

## 6. Listing Your Slide in the Portal

Once you finish creating a new presentation folder:
1. Open the root [index.html](file:///Users/peter/repo/ppt/index.html).
2. Insert a card link inside the `<main class="grid">` element pointing to your new folder:
   ```html
   <a href="my-new-deck/" class="card">
     <div class="card-header">
       <span class="card-tag">Category / Tag</span>
       <h3>Presentation Display Title</h3>
       <p>Brief summary of what this presentation covers.</p>
     </div>
     <div class="card-footer">
       <span>進入簡報 Slide Deck</span>
       <span class="arrow">→</span>
     </div>
   </a>
   ```
3. Commit and push your changes to GitHub to let the automated Pages deployment trigger.
