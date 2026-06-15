"use client";

import { useState, useEffect, useRef } from "react";
import { generateMaze, makeEmptyGrid } from "./hooks/useGrid";
import { usePathfinding } from "./hooks/usePathfinding";
import PathfindingGrid from "./components/PathfindingGrid";
import PathfindingControls from "./components/PathfindingControls";

export default function PathfindingPage() {
    const [grid, setGrid] = useState(makeEmptyGrid);
    const { run, pause, resume, reset, runState } = usePathfinding(grid, setGrid);

    const [elapsedMs, setElapsedMs] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const pausedAtRef = useRef<number>(0);  // accumulated ms before pause

    useEffect(() => {
        setGrid(generateMaze());
    }, []);

    // Drive the timer based on runState
    useEffect(() => {
        if (runState === "running") {
            // Record when this run segment started
            startTimeRef.current = Date.now();

            timerRef.current = setInterval(() => {
                setElapsedMs(pausedAtRef.current + (Date.now() - startTimeRef.current!));
            }, 50);

        } else if (runState === "paused") {
            // Freeze: accumulate elapsed so far
            if (startTimeRef.current !== null) {
                pausedAtRef.current += Date.now() - startTimeRef.current;
                startTimeRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

        } else if (runState === "done" || runState === "no-path") {
            // Stop timer, keep final value visible
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

        } else if (runState === "idle") {
            // Full reset
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            pausedAtRef.current = 0;
            startTimeRef.current = null;
            setElapsedMs(0);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [runState]);

    const handleReset = () => {
        reset();
        setGrid(generateMaze());
    };

    return (
        <div>
            <PathfindingGrid grid={grid} />
            <PathfindingControls
                onRun={run}
                onPause={pause}
                onResume={resume}
                onReset={handleReset}
                runState={runState}
                elapsedMs={elapsedMs}
            />
        </div>
    );
}