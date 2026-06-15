"use client";
import { PathfindingGrid as GridType } from "../types";

type Props = { grid: GridType };

const CELL_COLORS: Record<string, string> = {
    empty:  "#000000",
    wall:   "#ffffff",
    start:  "#2ecc71",
    end:    "#e74c3c",
    open:   "#4ea1ff",
    closed: "#1a4a7a",
    path: "#2ecc71",
};

export default function PathfindingGrid({ grid }: Props) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${grid.cols}, 14px)`,
                gridTemplateRows: `repeat(${grid.rows}, 14px)`,
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#ffffff",  // gap = white = wall color
                gap: "1px",
                padding: "1px",
                border: "2px solid #ffffff",
            }}
        >
            {grid.cells.flat().map((cell) => (
                <div
                    key={`${cell.row}-${cell.col}`}
                    style={{
                        width: 14,
                        height: 14,
                        background: CELL_COLORS[cell.type] ?? "#000000",
                    }}
                />
            ))}
        </div>
    );
}