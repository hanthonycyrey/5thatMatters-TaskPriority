# 5thatMatters-TaskPriority

a minimalist productivity app called "5 That Matter" - a task management tool built around a strict focus philosophy combining the Eisenhower Matrix, the 80/20 rule, and Warren Buffett's 25/5 rule, with Eat That Frog sequencing.

Core Philosophy: The app enforces a maximum of 5 active tasks at any time (Buffett 25/5). Before a task enters the active list, the user must classify it by importance and urgency (Eisenhower). Only tasks marked as Important can enter the active 5.

Urgent-but-not-Important tasks go to a "Delegate" pile. The active 5 are auto-sorted so the hardest/most impactful task is always shown first (Eat That Frog). All other tasks live in a "Someday / Not Now" graveyard — visually dimmed and inaccessible during focus mode.

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

a vibe code mobile app from bolt.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-zu9fhvca)
