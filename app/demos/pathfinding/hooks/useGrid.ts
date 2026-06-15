import { PathfindingCellParams, PathfindingCellType, PathfindingGrid } from "../types";

const GRID_ROWS = 41;
const GRID_COLS = 41;

export const START = { row: 0, col: 0 };
export const END = { row: GRID_ROWS - 1, col: GRID_COLS - 1 };

function makeCell(row: number, col: number, type: PathfindingCellType = "empty"): PathfindingCellParams {
    return { row, col, type, g: Infinity, h: 0, f: Infinity, parent: null };
}

export function makeEmptyGrid(): PathfindingGrid {
    const cells = Array.from({ length: GRID_ROWS }, (_, r) =>
        Array.from({ length: GRID_COLS }, (_, c) => makeCell(r, c))
    );
    return { rows: GRID_ROWS, cols: GRID_COLS, cells };
}

export function generateMaze(): PathfindingGrid {
    // Start fully walled
    const grid: PathfindingGrid = {
        rows: GRID_ROWS,
        cols: GRID_COLS,
        cells: Array.from({ length: GRID_ROWS }, (_, r) =>
            Array.from({ length: GRID_COLS }, (_, c) => makeCell(r, c, "wall"))
        ),
    };

    const visited = Array.from({ length: GRID_ROWS }, () =>
        new Array(GRID_COLS).fill(false)
    );

    function shuffle<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function carve(row: number, col: number) {
        visited[row][col] = true;
        grid.cells[row][col].type = "empty";

        const dirs = shuffle([[-2,0],[2,0],[0,-2],[0,2]]);

        for (const [dr, dc] of dirs) {
            const nr = row + dr;
            const nc = col + dc;

            if (nr < 0 || nr >= GRID_ROWS || nc < 0 || nc >= GRID_COLS) continue;
            if (visited[nr][nc]) continue;

            // Carve the wall between current room and neighbour room
            grid.cells[row + dr / 2][col + dc / 2].type = "empty";
            carve(nr, nc);
        }
    }

    // Start carving from top-left room
    carve(0, 0);

    grid.cells[START.row][START.col].type = "start";
    grid.cells[END.row][END.col].type = "end";

    return grid;
}

export function resetAlgoState(grid: PathfindingGrid): PathfindingGrid {
    return {
        ...grid,
        cells: grid.cells.map(row =>
            row.map(cell => {
                const wasAlgo =
                    cell.type === "open" ||
                    cell.type === "closed" ||
                    cell.type === "path";

                return {
                    ...cell,
                    type: wasAlgo ? "empty" : cell.type,
                    g: Infinity,
                    h: 0,
                    f: Infinity,
                    parent: null,
                };
            })
        ),
    };
}

export function heuristic(a: { row: number; col: number }, b: { row: number; col: number }) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function getNeighbors(cell: PathfindingCellParams, grid: PathfindingGrid) {
    const { row, col } = cell;
    const neighbors: PathfindingCellParams[] = [];

    const tryAdd = (r: number, c: number) => {
        const n = grid.cells[r]?.[c];
        if (!n) return;

        // HARD WALL BLOCK (single source of truth)
        if (n.type === "wall") return;

        neighbors.push(n);
    };

    if (row > 0) tryAdd(row - 1, col);
    if (row < grid.rows - 1) tryAdd(row + 1, col);
    if (col > 0) tryAdd(row, col - 1);
    if (col < grid.cols - 1) tryAdd(row, col + 1);

    return neighbors;
}