# SUKOON Garden

## Live Website

[Open SUKOON Garden](https://sukoongarden.lovable.app/)

## Overview

SUKOON Garden is a calming productivity web application that turns focused work into the gentle growth of a digital garden. Instead of treating a focus session as a bare countdown, the app frames time as something you can tend: choose a plant, settle into your work, and let the session grow into a new flower, tree, or small garden companion.

The project is designed around a soft, mindful experience. It combines a focus timer with breathing, mood reflection, gratitude notes, ambient rain, and a peaceful virtual garden, creating a small ritual for starting work and returning to yourself afterward.

## Features

- Focus timer with selectable plant durations from short sessions to deep work blocks
- Tree, flower, water plant, mushroom, and small plant rewards
- Animated plant growth with a circular progress indicator
- Session completion reward that adds the grown plant to the garden
- Virtual garden view with a scenic pond, hills, sky, path, and planted rewards
- Draggable plants inside the garden
- In-session garden progress count
- Mood selector that changes the garden weather and atmosphere
- Weather and garden animations, including rain, petals, sparkles, fireflies, and butterflies
- Guided 4-4-4-4 box breathing tool with cycle tracking
- Gratitude notes that also appear as a love-letter style view inside the garden
- Optional ambient rain sound generated in the browser
- Occasional animated garden visitors unlocked as the garden grows
- Responsive, polished UI with a warm cottagecore visual style

## How it Works

SUKOON opens as a cozy journal-style dashboard. At the top, the app shows the current day and time, followed by a button to visit the garden and a count of how many plants have been grown during the current visit.

Before beginning a focus session, the user can set the mood for the day, add a gratitude note, or use the box breathing tool to settle in. The selected mood carries into the garden view by changing its weather, color, and particle effects.

The focus flow begins in the Time-Off Focus Garden section. The user chooses a plant from the available list, with each plant tied to a specific focus duration. Pressing **Start focus** begins the countdown and animates the selected plant while the progress ring fills.

If the user stops the session early, the timer resets and no plant is added. When the timer reaches zero, the plant matures, a completion message appears, and the finished plant is added to the virtual garden.

The user can then open **Visit Your Garden** to see the reward placed into a scenic park-like garden. Plants can be dragged to new positions, gratitude notes can be opened as a little letter, and ambient rain can be toggled from the garden view. As more plants are grown, small animated visitors may appear in the garden.

## Screenshots

Screenshots are not included yet. Suggested placeholders:

| Home Journal | Focus Session | Virtual Garden |
| --- | --- | --- |
| Add screenshot here | Add screenshot here | Add screenshot here |

## Tech Stack

- React
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS
- Radix UI primitives
- Lucide React icons
- Web Audio API for ambient sound

## Installation

These steps are only for developers who want to run or edit the project on their own computer. If you only want to use the app, open the live website link above once it is available.

Clone the repository:

```bash
git clone https://github.com/Ananya8816/sukoongarden.git
cd sukoongarden
```

Install dependencies:

```bash
bun install
```

If you prefer npm, the project scripts are also available through `package.json`:

```bash
npm install
```

## Running Locally

For developers, start the development server:

```bash
bun run dev
```

Or with npm:

```bash
npm run dev
```

Then open the local URL shown in the terminal.

## Project Structure

```text
src/
  assets/                 Plant artwork used throughout the garden
  components/
    garden/               Virtual garden world and animated visitors
    journal/              Breathing, mood, gratitude, and focus tools
    ui/                   Shared UI primitives
  hooks/                  Shared React hooks
  lib/                    Garden state, plant data, sound, utilities, and errors
  routes/                 TanStack file-based routes
  router.tsx              Router setup
  server.ts               Server entry handling
  start.ts                TanStack Start configuration
  styles.css              Global theme, layout, and animation styles
```

## Future Improvements

- Save garden progress, mood, and gratitude notes across browser sessions
- Add a session history or calendar view for completed focus blocks
- Allow users to rename plants or organize garden layouts more intentionally
- Add screenshot assets to the README
- Include configurable focus durations or custom plant goals
- Add accessibility refinements for reduced motion and keyboard-based garden interactions
- Add automated tests for the focus timer, garden rewards, and mood-driven weather changes

## License

No license has been specified yet. Add a license before using or distributing the project publicly.
