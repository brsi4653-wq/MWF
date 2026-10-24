# MUST WIN FOREVER site

Home base website for MUST WIN FOREVER, Simon's umbrella brand. Every project (Discord bots, apps, YouTube, Twitch, controller mods, merch) goes out under it. One page: a scroll animated hero, Crew (people on the team), Projects (project cards), Links, footer. Hosted on GitHub Pages. Keep the scope small and the code simple.

## Tech
- Plain HTML, CSS and JS. No framework, no build step. GitHub Pages serves the repo root as is (`.nojekyll` is there on purpose).
- GSAP 3.15.0 + ScrollTrigger from jsDelivr, pinned to exact versions.
- `js/crew.js` holds the crew list and `js/projects.js` the project list. Adding someone or something means editing those arrays only, never the layout code.
- Only use links, handles and details Simon gives directly. Never guess or add platforms he didn't list.
- `js/hero.js` drives the hero. All logo positions are in main logo units (the viewBox of the brand pack's `MustWin_Main-Logo_Colour.svg`). The M/W shape is one element that slides, spins 450 degrees clockwise, scales into the Razor symbol (Standing x 1.557, turned 90 degrees) and docks onto the header logo.
- Respect `prefers-reduced-motion`: it gets a simple fade from the main logo to the Razor logo.
- Test at 390px wide as well as desktop. No horizontal overflow.

## Brand rules
- Colours (CSS variables in `css/style.css`): Winner's Black #141412 (main background), Forever Yellow #FED000 (accent, use sparingly so it hits hard), Mud #4A4630, Bone #E9E4D6 (the brand's white, never use pure white), Ash #9C978A (small text, labels), Frame Black #0E0E0C.
- The typed name is always "MUST WIN FOREVER" in English. Korean (영원히) only ever appears inside logo artwork, never as typed text, so platforms don't push the site to a Korean audience.
- Fonts: Dela Gothic One for headlines, JetBrains Mono for labels, UI and body. Don't use Inter, Roboto, Arial, Space Grotesk or system fonts.
- Never write em dashes or en dashes in site copy.
- Rejected ideas, never bring back: hazard tape, paint splatter, the 必勝 seal, the Mud+Wire or A77 names, plus sign cutouts, hollow brush strokes.
- Logo files in `assets/` are copies from the brand pack. Don't redraw or edit logo geometry.
