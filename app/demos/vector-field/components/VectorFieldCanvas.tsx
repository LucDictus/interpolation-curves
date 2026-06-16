"use client";
import { useEffect, useRef, useState } from "react";
import { generateVectorField } from "../hooks/useVectorField";
import { useParticles } from "../hooks/useParticles";
import ControlPanel from "@/app/components/ui/ControlPanel";
import Slider from "@/app/components/ui/Slider";
import VectorFieldControls from "./VectorFieldControls";

const CELL_SIZE = 40;
const TIME_STEP = 0.002;

export default function VectorFieldCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const [particleCount, setParticleCount] = useState(300);
    const [speed, setSpeed] = useState(1);
    const [scale, setScale] = useState(0.05);
    const [showArrows, setShowArrows] = useState(false);

    const mouseRef = useRef<{ x: number; y: number } | null>(null);
    const [radius, setRadius] = useState(150);

    const { particlesRef, update } = useParticles(dimensions.width, dimensions.height, particleCount);
    const timeRef = useRef(0);

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

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseLeave = () => {
            mouseRef.current = null;
        };

        window.addEventListener("resize", resize);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        return () => window.removeEventListener("resize", resize, "mousemove", handleMouseMove, "mouseleave", handleMouseLeave);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if (!dimensions.width || !dimensions.height) return;

        let frameId: number;

        const drawArrows = (field: ReturnType<typeof generateVectorField>) => {
            field.forEach((row, rowIndex) => {
                row.forEach(([vx, vy], colIndex) => {
                    const cx = colIndex * CELL_SIZE + CELL_SIZE / 2;
                    const cy = rowIndex * CELL_SIZE + CELL_SIZE / 2;
                    const arrowLength = CELL_SIZE * 0.35;
                    const ex = cx + vx * arrowLength;
                    const ey = cy + vy * arrowLength;

                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(ex, ey);
                    ctx.strokeStyle = "rgba(255,255,255,0.4)";
                    ctx.lineWidth = 1;
                    ctx.stroke();

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

        const draw = () => {
            timeRef.current += TIME_STEP;

            const field = generateVectorField(
                dimensions.width,
                dimensions.height,
                CELL_SIZE,
                timeRef.current,
                scale,
                mouseRef.current,
                radius
            );

            ctx.fillStyle = "#101214";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (showArrows) drawArrows(field);

            update(field, CELL_SIZE, canvas.width, canvas.height, speed);

            ctx.fillStyle = "rgba(255,255,255,0.8)";
            particlesRef.current.forEach((p) => {
                ctx.fillRect(p.x, p.y, 2, 2);
            });

            frameId = requestAnimationFrame(draw);
        };

        frameId = requestAnimationFrame(draw);
        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [dimensions, scale, speed, showArrows]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
            />
            <VectorFieldControls
                particleCount={particleCount} setParticleCount={setParticleCount}
                speed={speed} setSpeed={setSpeed}
                scale={scale} setScale={setScale}
                radius={radius} setRadius={setRadius}
                showArrows={showArrows} setShowArrows={setShowArrows}
            />
        </div>
    );
}