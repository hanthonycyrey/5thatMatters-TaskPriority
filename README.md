# 5thatMatters-Productivityapp

a minimalist productivity app called "5 That Matter" - a task management tool built around a strict focus philosophy combining the Eisenhower Matrix, the 80/20 rule, and Warren Buffett's 25/5 rule, with Eat That Frog sequencing.

vibe code mobile app from bolt.

Core Philosophy: The app enforces a maximum of 5 active tasks at any time (Buffett 25/5). Before a task enters the active list, the user must classify it by importance and urgency (Eisenhower). Only tasks marked as Important can enter the active 5.

Urgent-but-not-Important tasks go to a "Delegate" pile. The active 5 are auto-sorted so the hardest/most impactful task is always shown first (Eat That Frog). All other tasks live in a "Someday / Not Now" graveyard visually dimmed and inaccessible during focus mode.

App Structure & UI Zones:
1. The Frog - The single top task (highlighted, prominent). This is your #1 today. Do this first.
2. The 4 - The remaining 4 active tasks, stacked below. Simple, clean.
3. The Waiting Room - A collapsed/dimmed section of tasks not yet in the active 5. User can promote a task here only after completing one.
4. The Graveyard - Completed and deferred tasks. Minimal, archival.
Interactions & Rules:
* On adding a task, a 2-question micro-modal appears: "Is this Important?" (Yes/No) → "Is this Urgent?" (Yes/No). This creates the Eisenhower tag invisibly.
* If Important + Urgent → goes to Active 5 (or Waiting Room if full)
* If Important + Not Urgent → goes to Active 5 (scheduled, lower priority)
* If Not Important → goes straight to Graveyard with a gentle prompt: "Consider dropping this."
* Active 5 is hard-capped. The app refuses to add a 6th task without archiving one.
* Tasks can be tagged with an 80/20 flag - a small marker that asks: "Will this drive the majority of your results today?" Flagged tasks rise to the top.
* Completing "The Frog" triggers a subtle, satisfying animation and promotes the next task up.

* Visual Design:
* Aesthetic: Brutally minimal, editorial, monochrome-first - think a printed Moleskine page meets a Bloomberg terminal. No gradients, no rounded cards, no color noise.
* Color palette: Off-white or warm cream background (`#F5F0E8`), near-black text (`#1A1A1A`), single accent color used sparingly (deep forest green `#2D5016` or burnt sienna `#C4622D` - pick one, use it only for "The Frog" highlight and CTAs).
* Typography: Tall serif for headings (like Playfair Display or DM Serif Display), clean monospace for task text (like IBM Plex Mono or Roboto Mono) — creates an intentional tension between editorial and functional.
* No icons except one: a small frog `🐸` emoji next to task #1. Nothing else decorative.
* Layout: Single-column, left-aligned, generous line-height. The interface should feel like a document, not an app.
* Micro-animations: Task completion should feel like crossing something off a physical list - a slow strikethrough line animation, then a fade-out.
* Focus Mode: A full-screen toggle that hides everything except The Frog - just the task text and a "Done" button. Distraction-free.
Tech stack: React with hooks (useState, useReducer), localStorage for persistence, Tailwind for layout only, custom CSS for typography and animations. No backend needed. Single-file component preferred.
Tone of the app: The copy should feel like a strict but wise mentor. Use phrases like "What must get done today?", "You've already decided. Start.", "Not now means not ever - are you sure?"



[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-zu9fhvca)
