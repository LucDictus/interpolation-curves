import { useRef, useState } from "react";
import {
    PathfindingCellParams,
    PathfindingGrid,
    PathfindingParams,
    RunState
} from "../types";
import { END, START, getNeighbors, heuristic, resetAlgoState } from "./useGrid";

export function usePathfinding(
    grid: PathfindingGrid,
    setGrid: React.Dispatch<React.SetStateAction<PathfindingGrid>>
) {
    const [runState, setRunState] = useState<RunState>("idle");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Persist algorithm state across pause/resume
    const openSetRef = useRef<PathfindingCellParams[]>([]);
    const openSetMapRef = useRef<Set<string>>(new Set());
    const closedSetRef = useRef<Set<string>>(new Set());
    const workGridRef = useRef<PathfindingGrid | null>(null);
    const algorithmRef = useRef<PathfindingParams["algorithm"]>("astar");
    const speedRef = useRef<number>(50);

    function stop() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    function pause() {
        if (intervalRef.current) {
            stop();
            setRunState("paused");
        }
    }

    function resume() {
        if (!workGridRef.current) return;
        setRunState("running");
        intervalRef.current = setInterval(
            () => step(workGridRef.current!),
            speedRef.current
        );
    }

    function reset() {
        stop();
        openSetRef.current = [];
        openSetMapRef.current = new Set();
        closedSetRef.current = new Set();
        workGridRef.current = null;
        setGrid(resetAlgoState(grid));
        setRunState("idle");
    }

    function run(params: PathfindingParams) {
        const { algorithm, speed } = params;
        algorithmRef.current = algorithm;
        speedRef.current = speed;

        const cleanGrid = resetAlgoState(grid);
        setGrid(cleanGrid);
        setRunState("running");

        const workGrid: PathfindingGrid = {
            ...cleanGrid,
            cells: cleanGrid.cells.map(row => row.map(cell => ({ ...cell }))),
        };

        workGridRef.current = workGrid;

        const key = (r: number, c: number) => `${r},${c}`;

        const start = workGrid.cells[START.row][START.col];
        start.g = 0;
        start.h = heuristic(START, END);
        start.f = start.h;

        openSetRef.current = [start];
        openSetMapRef.current = new Set([key(start.row, start.col)]);
        closedSetRef.current = new Set();

        intervalRef.current = setInterval(() => step(workGrid), speed);
    }

    function step(workGrid: PathfindingGrid) {
        const openSet = openSetRef.current;
        const openSetMap = openSetMapRef.current;
        const closedSet = closedSetRef.current;
        const algorithm = algorithmRef.current;
        const key = (r: number, c: number) => `${r},${c}`;

        if (openSet.length === 0) {
            stop();
            setRunState("no-path");
            return;
        }

        openSet.sort((a, b) =>
            algorithm === "astar" ? a.f - b.f : a.g - b.g
        );

        const current = openSet.shift()!;
        openSetMap.delete(key(current.row, current.col));

        const ck = key(current.row, current.col);
        if (closedSet.has(ck)) return;
        closedSet.add(ck);

        if (current.row === END.row && current.col === END.col) {
            stop();
            tracePath(workGrid, setGrid);
            setRunState("done");
            return;
        }

        const neighbors = getNeighbors(current, workGrid);

        for (const neighbor of neighbors) {
            const nk = key(neighbor.row, neighbor.col);
            if (closedSet.has(nk)) continue;

            const tentativeG = current.g + 1;
            if (tentativeG < neighbor.g) {
                const h = heuristic(neighbor, END);
                const updated = {
                    ...neighbor,
                    g: tentativeG,
                    h,
                    f: tentativeG + h,
                    parent: { row: current.row, col: current.col },
                };
                workGrid.cells[neighbor.row][neighbor.col] = updated;

                if (!openSetMap.has(nk)) {
                    openSet.push(updated);
                    openSetMap.add(nk);
                }
            }
        }

        setGrid(prev => ({
            ...prev,
            cells: prev.cells.map(row =>
                row.map(cell => {
                    const k = key(cell.row, cell.col);
                    if (
                        cell.type === "start" ||
                        cell.type === "end" ||
                        cell.type === "wall"
                    ) return cell;
                    if (closedSet.has(k)) return { ...cell, type: "closed" };
                    if (openSetMap.has(k)) return { ...cell, type: "open" };
                    return cell;
                })
            ),
        }));
    }

    return { run, pause, resume, reset, runState };
}

function tracePath(
    workGrid: PathfindingGrid,
    setGrid: React.Dispatch<React.SetStateAction<PathfindingGrid>>
) {
    const path: { row: number; col: number }[] = [];
    let current: { row: number; col: number } | null = END;

    while (current) {
        path.unshift(current);
        current = workGrid.cells[current.row][current.col].parent;
    }

    path.forEach(({ row, col }, i) => {
        setTimeout(() => {
            setGrid(prev => ({
                ...prev,
                cells: prev.cells.map(r =>
                    r.map(cell => {
                        if (
                            cell.row === row &&
                            cell.col === col &&
                            cell.type !== "start" &&
                            cell.type !== "end"
                        ) {
                            return { ...cell, type: "path" };
                        }
                        return cell;
                    })
                ),
            }));
        }, i * 20);
    });
}