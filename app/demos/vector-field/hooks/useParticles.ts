"use client";
import { useRef, useEffect } from "react";
import { particle, vectorField } from "../types";

export function useParticles(width: number, height: number, particleCount: number) {
    const particlesRef = useRef<particle[]>([]);

    // (Re)initialize whenever size or count changes
    useEffect(() => {
        if (!width || !height) return;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
        }));
    }, [width, height, particleCount]);

    function update(field: vectorField, cellSize: number, width: number, height: number, speed: number) {
        const particles = particlesRef.current;
        particles.forEach((p) => {
            const col = Math.floor(p.x / cellSize);
            const row = Math.floor(p.y / cellSize);
            const cellRow = field[row];
            const cell = cellRow ? cellRow[col] : undefined;
            if (!cell) return;

            const [vx, vy] = cell;
            p.x += vx * speed;
            p.y += vy * speed;

            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;
            if (p.y > height) p.y = 0;
            if (p.y < 0) p.y = height;
        });
    }

    return { particlesRef, update };
}