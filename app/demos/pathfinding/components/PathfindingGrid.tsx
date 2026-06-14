"use client";

import { PathfindingGrid as GridType } from "../types";

type Props = {
    grid: GridType;
};

const CELL_COLORS: Record<string, string> = {
    empty: "transparent",

    // only walls are visible → white border walls
    wall: "#ffffff",

    start: "#2ecc71",
    end: "#e74c3c",

    // explored / algorithm progress
    open: "rgba(255, 165, 0, 0.35)",     // orange glow
    closed: "rgba(255, 140, 0, 0.55)",   // stronger orange

    // final shortest path
    path: "#2ecc71",
};

export default function PathfindingGrid({ grid }: Props) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${grid.cols}, 18px)`,
                gridTemplateRows: `repeat(${grid.rows}, 18px)`,

                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",

                background: "transparent",
            }}
        >
            {grid.cells.flat().map((cell) => {
                const isWall = cell.type === "wall";

                return (
                    <div
                        key={`${cell.row}-${cell.col}`}
                        style={{
                            width: 18,
                            height: 18,

                            background:
                                CELL_COLORS[cell.type] ?? "transparent",

                            // only show border for walls
                            border: isWall
                                ? "1px solid #ffffff"
                                : "none",
                        }}
                    />
                );
            })}
        </div>
    );
}