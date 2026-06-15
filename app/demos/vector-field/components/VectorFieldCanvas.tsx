"use client";

import {useEffect, useRef, useState} from "react";
import {useVectorField} from "@/app/demos/vector-field/hooks/useVectorField";

const CELL_SIZE = 40;

export default function VectorFieldCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const field = useVectorField(dimensions.width, dimensions.height, CELL_SIZE);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            setDimensions({ width: canvas.width, height: canvas.height });
        };

        resize();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = () => {
            field.forEach((row, rowIndex) => {
                row.forEach(([vx, vy], colIndex) => {
                    const cx = colIndex * CELL_SIZE + CELL_SIZE / 2;
                    const cy = rowIndex * CELL_SIZE + CELL_SIZE / 2;

                    const arrowLength = CELL_SIZE * 0.35;
                    const ex = cx + vx * arrowLength;
                    const ey = cy + vy * arrowLength;

                    // line
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(ex, ey);
                    ctx.strokeStyle = "rgba(255,255,255,0.4)";
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // arrowhead
                    const angle = Math.atan2(vy, vx);
                    const headLength = 6;
                    ctx.beginPath();
                    ctx.moveTo(ex, ey);
                    ctx.lineTo(ex - headLength * Math.cos(angle - 0.5), ey - headLength * Math.sin(angle - 0.5));
                    ctx.moveTo(ex, ey);
                    ctx.lineTo(ex - headLength * Math.cos(angle + 0.5), ey - headLength * Math.sin(angle + 0.5));
                    ctx.stroke();
                });
            });
        };

        draw();

    }, [field]);

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