"use client";

import { useEffect, useState } from "react";

import { generateMaze } from "./hooks/useGrid";
import { usePathfinding } from "./hooks/usePathfinding";

import PathfindingGrid from "./components/PathfindingGrid";
import PathfindingControls from "./components/PathfindingControls";

export default function PathfindingPage() {
    const [grid, setGrid] = useState(generateMaze);

    const { run, reset, runState } = usePathfinding(grid, setGrid);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <PathfindingGrid grid={grid} />

            <PathfindingControls
                onRun={run}
                onReset={reset}
                runState={runState}
            />
        </div>
    );
}