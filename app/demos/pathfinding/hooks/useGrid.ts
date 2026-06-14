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
    const grid = makeEmptyGrid();

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const isStart = row === START.row && col === START.col;
            const isEnd = row === END.row && col === END.col;

            if (isStart) {
                grid.cells[row][col].type = "start";
                continue;
            }

            if (isEnd) {
                grid.cells[row][col].type = "end";
                continue;
            }

            grid.cells[row][col].type = Math.random() < 0.3 ? "wall" : "empty";
        }
    }

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