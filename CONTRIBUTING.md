# Interpolation Curves Lab — Contributor Guide

A practical reference for adding new demos to this project, whether you're the original author or a new developer joining the repo. Follow this guide top to bottom for every new simulation you add.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Step-by-Step: Adding a New Demo](#3-step-by-step-adding-a-new-demo)
4. [File Templates](#4-file-templates)
5. [Shared Components](#5-shared-components)
6. [Rules & Conventions](#6-rules--conventions)
7. [Common Mistakes](#7-common-mistakes)

---

## 1. Project Overview

This is a Next.js interactive simulation playground. Each demo is a fully self-contained system exploring motion, physics, algorithms, or emergent behavior.

**Tech stack:** Next.js · TypeScript · Framer Motion · CSS Variables (no component library)

**The core idea is simple:** the `demoRegistry` is a flat list of demo definitions. The `Navigation` and `PageTransition` components read from it automatically. Adding a demo means creating a folder, writing a manifest, and registering it — nothing else in the shell needs to change.

---

## 2. Folder Structure

```
interpolation-curves/
  app/
    globals.css                        ← global tokens, .panel, .label, .value
    layout.tsx                         ← Navigation + PageTransition shell
    page.tsx                           ← homepage

    components/
      ui/
        ControlPanel.tsx               ← fixed top-right panel wrapper
        Slider.tsx                     ← labeled range input
      layout/
        Navigation.tsx                 ← reads demoRegistry, renders sidebar
        PageTransition.tsx             ← reads demoRegistry, animates layout

    demos/
      registry.ts                      ← import every manifest here
      types.ts                         ← DemoDefinition type

      [demo-name]/                     ← one folder per demo
        manifest.ts                    ← name, path, category, x, y, fullScreen
        page.tsx                       ← thin page, composes components
        types.ts                       ← demo-specific param types
        hooks/
          use[DemoName].ts             ← simulation logic as a hook (if needed)
        components/
          [DemoName]Canvas.tsx         ← rendering / animation loop (if needed)
          [DemoName]Controls.tsx       ← controls panel using ControlPanel + Slider
```

### What goes where

| Location | Contains |
|---|---|
| `app/components/ui/` | Shared UI components used by 2+ demos |
| `app/components/layout/` | Shell-level components (navigation, transitions) — do not touch per-demo |
| `demos/[name]/` | Everything specific to one demo |
| `demos/[name]/hooks/` | Custom hooks for simulation logic |
| `demos/[name]/components/` | UI components that only this demo uses |

**Rule of thumb:** if a component or hook is only used by one demo, it lives inside that demo's folder. It earns a place in `components/ui/` only when a second demo needs it.

---

## 3. Step-by-Step: Adding a New Demo

### Step 1 — Create the folder

```
app/demos/[your-demo-name]/
```

Use kebab-case. Examples: `spring-network`, `pathfinding`, `cellular-automata`.

### Step 2 — Write `manifest.ts`

The manifest is the only file the registry and navigation need to know about your demo.

```typescript
// app/demos/[your-demo-name]/manifest.ts
import { DemoDefinition } from "../types";

const demo: DemoDefinition = {
    name: "Your Demo Name",        // displayed in the sidebar
    path: "/demos/your-demo-name", // must match the folder path
    category: "PHYSICS",           // groups demos in the sidebar (see categories below)
    x: 1,                          // spatial position on the layout grid (see grid below)
    y: 0,
    fullScreen: true,              // true for canvas demos, false/omit for UI demos
};

export default demo;
```

**Categories in use:** `PHYSICS` · `SYSTEMS` · `ALGORITHMS` · `MATHEMATICS` · `MECHANICS`
Add a new category string freely — Navigation groups by it automatically.

**The x/y grid** controls the `PageTransition` parallax offset and the spatial opacity bias in Navigation. Place your demo logically relative to existing ones:

```
x=0,y=0   x=1,y=0   x=2,y=0
Second     [open]    Boids
Order

x=0,y=1   x=1,y=1   x=2,y=1
[open]     [open]    [open]
```

Demos don't need to be adjacent. Pick coordinates that make spatial sense for your category.

### Step 3 — Register it in `registry.ts`

```typescript
// app/demos/registry.ts
import secondOrder from "./second-order/manifest";
import boids from "./boids/manifest";
import yourDemo from "./your-demo-name/manifest";  // ← add this

export const demoRegistry = [secondOrder, boids, yourDemo];  // ← and this
```

This is the only file outside your demo folder you need to touch.

### Step 4 — Define your types

```typescript
// app/demos/[your-demo-name]/types.ts
export type YourDemoParams = {
    someValue: number;
    anotherValue: number;
    // all runtime-tunable parameters go here
};
```

### Step 5 — Build your components

For canvas/simulation demos, split into two components:

**`[DemoName]Canvas.tsx`** — owns the `useEffect` + animation loop + physics. Accepts `params` as a prop and reads them via a `ref` so the loop doesn't restart on every param change.

**`[DemoName]Controls.tsx`** — owns the control panel UI. Uses `ControlPanel` and `Slider` from `components/ui/`. Accepts `params`, `setParams`, and `onReset`.

See the [File Templates](#4-file-templates) section for copy-paste starters.

### Step 6 — Write `page.tsx`

The page composes your components and holds state. It should be short — under 40 lines.

```typescript
// app/demos/[your-demo-name]/page.tsx
"use client";

import { useRef, useState } from "react";
import YourDemoCanvas from "./components/YourDemoCanvas";
import YourDemoControls from "./components/YourDemoControls";
import { YourDemoParams } from "./types";

const DEFAULT_PARAMS: YourDemoParams = {
    someValue: 1,
    anotherValue: 0.5,
};

export default function YourDemoPage() {
    const [params, setParams] = useState<YourDemoParams>(DEFAULT_PARAMS);
    const resetRef = useRef<() => void>(() => {});

    const handleReset = () => {
        setParams(DEFAULT_PARAMS);
        resetRef.current();
    };

    return (
        <>
            <YourDemoCanvas
                params={params}
                onReset={(fn) => { resetRef.current = fn; }}
            />
            <YourDemoControls
                params={params}
                setParams={setParams}
                onReset={handleReset}
            />
        </>
    );
}
```

### Step 7 — Verify

- Demo appears in the sidebar under the correct category
- Navigating to `/demos/your-demo-name` renders correctly
- Controls update the simulation in real time
- Reset restores both UI state and simulation state
- No TypeScript errors

---

## 4. File Templates

### `[DemoName]Canvas.tsx`

```typescript
"use client";

import { useEffect, useRef } from "react";
import { YourDemoParams } from "../types";

type Props = {
    params: YourDemoParams;
    onReset?: (resetFn: () => void) => void;
};

export default function YourDemoCanvas({ params, onReset }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const paramsRef = useRef(params);

    // Keep paramsRef in sync without restarting the loop
    useEffect(() => {
        paramsRef.current = params;
    }, [params]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const reset = () => {
            // initialize simulation state here
        };

        reset();
        if (onReset) onReset(reset);

        const draw = () => {
            ctx.fillStyle = "#101214";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // read from paramsRef.current (not params) inside the loop
            const { someValue } = paramsRef.current;

            // update + render simulation here

            frameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resize);
        };
    }, []); // empty deps — loop runs once, reads params via ref

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
            }}
        />
    );
}
```

### `[DemoName]Controls.tsx`

```typescript
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ControlPanel from "../../../components/ui/ControlPanel";
import Slider from "../../../components/ui/Slider";
import { YourDemoParams } from "../types";

type Props = {
    params: YourDemoParams;
    setParams: React.Dispatch<React.SetStateAction<YourDemoParams>>;
    onReset: () => void;
};

export default function YourDemoControls({ params, setParams, onReset }: Props) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
            >
                <ControlPanel title="YOUR DEMO CONTROLS">
                    <Slider
                        label="SOME VALUE"
                        min={0}
                        max={10}
                        step={0.1}
                        value={params.someValue}
                        onChange={(v) => setParams(p => ({ ...p, someValue: v }))}
                    />

                    <button
                        onClick={onReset}
                        style={{
                            marginTop: 15,
                            width: "100%",
                            border: "1px solid rgba(255,255,255,.15)",
                            background: "transparent",
                            padding: 10,
                            cursor: "pointer",
                            color: "var(--text-primary)",
                        }}
                    >
                        RESET
                    </button>
                </ControlPanel>
            </motion.div>
        </AnimatePresence>
    );
}
```

---

## 5. Shared Components

### `ControlPanel`

Renders the fixed top-right floating panel. Pass a `title` and nest `Slider` components and a reset button as children.

```typescript
<ControlPanel title="MY CONTROLS">
    {/* sliders and buttons here */}
</ControlPanel>
```

### `Slider`

A labeled range input. The `decimals` prop controls how many decimal places the displayed value shows (default: 2).

```typescript
<Slider
    label="SPEED"
    min={0.5}
    max={6}
    step={0.1}
    value={params.speed}
    onChange={(v) => setParams(p => ({ ...p, speed: v }))}
    decimals={1}
/>
```

### CSS Variables

Use these tokens from `globals.css` instead of hardcoded values:

| Variable | Use |
|---|---|
| `var(--text-primary)` | Main text, active elements |
| `var(--text-muted)` | Labels, secondary info |
| `var(--text-blue)` | Accent, data points |
| `var(--text-red)` | Warnings, cursors |
| `var(--text-green)` | Positive states |
| `var(--border)` | Panel borders |
| `var(--bg)` | Background |

### CSS Classes

| Class | Use |
|---|---|
| `.panel` | Glassmorphism bordered container |
| `.label` | Small caps muted label |
| `.value` | Numeric display |

---

## 6. Rules & Conventions

**Co-locate by demo.** Everything a demo needs lives inside its folder. Deleting a demo means deleting one folder — nothing else.

**`page.tsx` stays thin.** No physics, no canvas loops, no large useEffects in the page file. It composes components and holds state only.

**Read params via ref inside animation loops.** Putting `params` in the `useEffect` dependency array restarts the loop every time a slider moves. Instead, keep a `paramsRef` synced by a separate `useEffect` and read `paramsRef.current` inside the loop.

**`DEFAULT_PARAMS` lives in `page.tsx`.** The reset handler sets state back to it and calls the canvas reset function. This keeps reset logic in one place.

**Don't put demo-specific types in the root `types/` folder.** The root `demos/types.ts` is only for `DemoDefinition`. Each demo owns its own param types in `demos/[name]/types.ts`.

**`fullScreen: true` for canvas demos.** This tells `PageTransition` to skip the parallax wrapper, which would otherwise clip a `position: fixed` canvas.

**Only touch `registry.ts` outside your folder.** Every other shared file (`Navigation`, `PageTransition`, `globals.css`) should not need editing to add a new demo.

---

## 7. Common Mistakes

**Forgetting `"use client"` on interactive components.** Any file that uses `useState`, `useEffect`, `useRef`, or browser APIs needs the `"use client"` directive at the top.

**Putting `params` in the animation loop's `useEffect` deps.** This restarts the entire loop (and resets simulation state) every time a slider moves. Use a ref pattern instead — see the canvas template above.

**Using `isOpen`/`setIsOpen` props on controls that don't implement collapsing.** Either wire it up or leave it out. Dead props in interfaces cause confusion.

**Incomplete `types.ts`.** Define every parameter your simulation actually uses in `types.ts`. If `DEFAULT_PARAMS` in `page.tsx` has a key that isn't in the type, TypeScript will catch it — but only if the type is complete to begin with.

**Naming the folder differently from the path.** The folder `demos/spring-network/` must match the manifest's `path: "/demos/spring-network"` exactly. Next.js file-based routing depends on it.

**Adding a component to `components/ui/` before it's shared.** Extract to shared only when a second demo needs it. Premature abstraction makes the shared folder noisy and hard to understand.