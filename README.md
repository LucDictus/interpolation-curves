# Interpolation Curves Lab — Simulation Projects

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A growing interactive simulation playground built with Next.js.
Each demo is a self-contained system exploring motion, physics, algorithms, or emergent behavior — all building toward a full browser-based wind tunnel simulator.

---

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## Completed Projects

Fully implemented and working:

### Second Order System
- Damped spring motion model
- Frequency, damping, and response controls
- Cursor follower physics system
- Foundation for motion-based interactions

### Boids Simulation
- Multi-agent flocking system
- Separation, alignment, and cohesion rules
- Emergent group behavior (bird/fish-like motion)

---

## In Progress

### Pathfinding Visualizer (v1 done — rework in progress)
- A* / Dijkstra visualization, v1 functional
- Not yet merged — being reworked for a better/faster solution
- Planned improvements: performance optimization and cleaner solver architecture

---

## Planned Projects (Backlog)

### Physics / Motion Systems
- Spring Network (mass-spring system, soft-body behavior)
- Car Suspension Simulator (real-world damping + vibration model)
- Rigid Body Rotation System (torque, angular momentum, inertia)

### Algorithm Visualizations
- Cellular Automata (Game of Life variants)
- Vector Field Flow Simulation (noise-driven motion fields)

### Mechanical / Engine Systems
- Engine Piston Simulation (crankshaft + periodic motion)
- Gear System Simulator (rotational ratio systems)
- Differential Drive Robot Simulation

### Mathematical Visual Systems
- Parametric Curve Explorer (Bezier curves + interpolation)
- Wave Interference Simulation (harmonics + oscillation patterns)
- Field Visualization System (vector/scalar fields)

---

## End Goal — Wind Tunnel Simulator

The main project this playground is building toward: a full interactive browser-based wind tunnel where users can:

- Place or load objects from a library into the tunnel
- Adjust wind speed, pressure, turbulence, and fluid properties
- Visualize airflow, drag, lift, and pressure fields in real time
- Observe how object geometry affects fluid behavior

Every simulation in this project is a stepping stone toward the skills needed to build this.

---

## Project Vision

A modular browser-based simulation engine where every demo behaves like a "world" with:
- Its own rules and behavior
- Shared navigation and transitions
- Reusable physics and math systems
- Consistent interaction patterns
