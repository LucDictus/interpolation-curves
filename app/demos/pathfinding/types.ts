export type PathfindingCellType = "empty" | "wall" | "start" | "end" | "open" | "closed" | "path";

export type PathfindingCellParams = {
    row: number;
    col: number;
    type: PathfindingCellType;
    g: number;
    h: number;
    f: number;
    parent: { row: number; col: number } | null;
};

export type PathfindingGrid = {
    rows: number;
    cols: number;
    cells: PathfindingCellParams[][];
};

export type PathfindingParams = {
    algorithm: "astar" | "dijkstra";
    speed: number;
};

export type RunState = "idle" | "running" | "done" | "no-path";