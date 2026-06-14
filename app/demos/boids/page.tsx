"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Boid = {
    x: number;
    y: number;
    vx: number;
    vy: number;
};

const COUNT = 100;

const DEFAULT_PARAMS = {
    separationDist: 40,
    separationForce: 0.05,

    alignmentDist: 80,
    alignmentForce: 0.02,

    cohesionDist: 120,
    cohesionForce: 0.001,

    speed: 2,

    predatorDist: 120,
    predatorForce: 0.15,
};

export default function BoidsDemo() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [params, setParams] = useState(DEFAULT_PARAMS);
    const paramsRef = useRef(params);

    const boidsRef = useRef<Boid[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        paramsRef.current = params;
    }, [params]);

    const reset = () => {
        const fresh = { ...DEFAULT_PARAMS };

        setParams(fresh);
        paramsRef.current = fresh;

        boidsRef.current = Array.from({ length: COUNT }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
        }));
    };

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

        reset();

        const computeForces = (boid: Boid) => {
            const {
                separationDist,
                separationForce,
                alignmentDist,
                alignmentForce,
                cohesionDist,
                cohesionForce,
                speed,
                predatorDist,
                predatorForce,
            } = paramsRef.current;

            let sepX = 0,
                sepY = 0;

            let avgVx = 0,
                avgVy = 0,
                alignCount = 0;

            let centerX = 0,
                centerY = 0,
                cohesionCount = 0;

            for (const other of boidsRef.current) {
                if (other === boid) continue;

                const dx = boid.x - other.x;
                const dy = boid.y - other.y;
                const dist = Math.hypot(dx, dy);

                // SEPARATION (avoid crowding)
                if (dist < separationDist && dist > 0) {
                    sepX += dx / dist;
                    sepY += dy / dist;
                }

                // ALIGNMENT (match velocity)
                if (dist < alignmentDist) {
                    avgVx += other.vx;
                    avgVy += other.vy;
                    alignCount++;
                }

                // COHESION (move to center)
                if (dist < cohesionDist) {
                    centerX += other.x;
                    centerY += other.y;
                    cohesionCount++;
                }
            }

            // apply separation
            boid.vx += sepX * separationForce;
            boid.vy += sepY * separationForce;

            // apply alignment
            if (alignCount > 0) {
                avgVx /= alignCount;
                avgVy /= alignCount;

                boid.vx += (avgVx - boid.vx) * alignmentForce;
                boid.vy += (avgVy - boid.vy) * alignmentForce;
            }

            // apply cohesion
            if (cohesionCount > 0) {
                centerX /= cohesionCount;
                centerY /= cohesionCount;

                boid.vx += (centerX - boid.x) * cohesionForce;
                boid.vy += (centerY - boid.y) * cohesionForce;
            }

            // PREDATOR (mouse escape)
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

            // SPEED LIMIT (soft clamp)
            const currentSpeed = Math.hypot(boid.vx, boid.vy);

            if (currentSpeed > 0) {
                const scale = speed / currentSpeed;

                const smoothing = 0.05;
                const finalScale = 1 + (scale - 1) * smoothing;

                boid.vx *= finalScale;
                boid.vy *= finalScale;
            }
        };

         // animation loop
        const draw = () => {
            ctx.fillStyle = "#101214";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (const boid of boidsRef.current) {
                computeForces(boid);

                boid.x += boid.vx;
                boid.y += boid.vy;

                // wrap edges
                if (boid.x < 0) boid.x = canvas.width;
                if (boid.x > canvas.width) boid.x = 0;
                if (boid.y < 0) boid.y = canvas.height;
                if (boid.y > canvas.height) boid.y = 0;

                // render
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
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{
                        duration: 0.18,
                        ease: "easeOut",
                    }}
                    className="panel"
                    style={{
                        position: "fixed",
                        top: 25,
                        right: 25,
                        width: 300,
                        padding: 16,
                        zIndex: 1000,
                        transformOrigin: "top right",
                    }}
                >
                    <div className="label">BOIDS CONTROLS</div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">SEPARATION DIST</div>
                        <div className="value">{params.separationDist.toFixed(2)}</div>
                        <input
                            type="range"
                            min="10"
                            max="120"
                            value={params.separationDist}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    separationDist: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">ALIGNMENT FORCE</div>
                        <div className="value">{params.alignmentForce.toFixed(2)}</div>
                        <input
                            type="range"
                            min="0.001"
                            max="0.1"
                            step="0.001"
                            value={params.alignmentForce}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    alignmentForce: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">COHESION FORCE</div>
                        <div className="value">{params.cohesionForce.toFixed(2)}</div>
                        <input
                            type="range"
                            min="0.0001"
                            max="0.02"
                            step="0.0001"
                            value={params.cohesionForce}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    cohesionForce: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">SPEED</div>
                        <div className="value">{params.speed.toFixed(2)}</div>
                        <input
                            type="range"
                            min="0.5"
                            max="6"
                            step="0.1"
                            value={params.speed}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    speed: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">PREDATOR FORCE</div>
                        <div className="value">{params.predatorForce.toFixed(2)}</div>
                        <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.01"
                            value={params.predatorForce}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    predatorForce: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <button
                        onClick={reset}
                        style={{
                            marginTop: 15,
                            width: "100%",
                            border: "1px solid rgba(255,255,255,.15)",
                            background: "transparent",
                            padding: 10,
                            cursor: "pointer",
                            color: "var(--text-primary)",
                        }}
                    >
                        RESET
                    </button>
                </motion.div>
            </AnimatePresence>

            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                }}
            />
        </>
    );
}