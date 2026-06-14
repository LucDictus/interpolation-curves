"use client";

import { useEffect, useRef } from "react";
import { BoidsParams } from "../types";

type Boid = {
    x: number;
    y: number;
    vx: number;
    vy: number;
};

const COUNT = 100;

type Props = {
    params: BoidsParams;
    onReset?: (resetFn: () => void) => void;
};

export default function BoidsCanvas({ params, onReset }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const paramsRef = useRef(params);
    const boidsRef = useRef<Boid[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        paramsRef.current = params;
    }, [params]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouse);

        const reset = () => {
            boidsRef.current = Array.from({ length: COUNT }).map(() => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
            }));
        };

        reset();

        if (onReset) onReset(reset);

        const computeForces = (boid: Boid) => {
            const {
                separationDist, separationForce,
                alignmentDist, alignmentForce,
                cohesionDist, cohesionForce,
                speed,
                predatorDist, predatorForce,
            } = paramsRef.current;

            let sepX = 0, sepY = 0;
            let avgVx = 0, avgVy = 0, alignCount = 0;
            let centerX = 0, centerY = 0, cohesionCount = 0;

            for (const other of boidsRef.current) {
                if (other === boid) continue;

                const dx = boid.x - other.x;
                const dy = boid.y - other.y;
                const dist = Math.hypot(dx, dy);

                if (dist < separationDist && dist > 0) {
                    sepX += dx / dist;
                    sepY += dy / dist;
                }

                if (dist < alignmentDist) {
                    avgVx += other.vx;
                    avgVy += other.vy;
                    alignCount++;
                }

                if (dist < cohesionDist) {
                    centerX += other.x;
                    centerY += other.y;
                    cohesionCount++;
                }
            }

            boid.vx += sepX * separationForce;
            boid.vy += sepY * separationForce;

            if (alignCount > 0) {
                avgVx /= alignCount;
                avgVy /= alignCount;
                boid.vx += (avgVx - boid.vx) * alignmentForce;
                boid.vy += (avgVy - boid.vy) * alignmentForce;
            }

            if (cohesionCount > 0) {
                centerX /= cohesionCount;
                centerY /= cohesionCount;
                boid.vx += (centerX - boid.x) * cohesionForce;
                boid.vy += (centerY - boid.y) * cohesionForce;
            }

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const dx = boid.x - mx;
            const dy = boid.y - my;
            const dist = Math.hypot(dx, dy);

            if (dist < predatorDist && dist > 0) {
                const force = (1 - dist / predatorDist) * predatorForce;
                boid.vx += (dx / dist) * force;
                boid.vy += (dy / dist) * force;
            }

            const currentSpeed = Math.hypot(boid.vx, boid.vy);
            if (currentSpeed > 0) {
                const scale = speed / currentSpeed;
                const smoothing = 0.05;
                const finalScale = 1 + (scale - 1) * smoothing;
                boid.vx *= finalScale;
                boid.vy *= finalScale;
            }
        };

        const draw = () => {
            ctx.fillStyle = "#101214";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (const boid of boidsRef.current) {
                computeForces(boid);

                boid.x += boid.vx;
                boid.y += boid.vy;

                if (boid.x < 0) boid.x = canvas.width;
                if (boid.x > canvas.width) boid.x = 0;
                if (boid.y < 0) boid.y = canvas.height;
                if (boid.y > canvas.height) boid.y = 0;

                ctx.fillStyle = "#4ea1ff";
                ctx.beginPath();
                ctx.arc(boid.x, boid.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            frameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouse);
        };
    }, []);

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