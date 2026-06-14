"use client";

import { useEffect, useState } from "react";
import { useSecondOrder } from "../hooks/useSecondOrder";
import { SecondOrderParams } from "../types";

type Props = {
    params: SecondOrderParams;
};

export default function CursorFollower({ params }: Props) {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    const x = useSecondOrder(mouse.x, params);
    const y = useSecondOrder(mouse.y, params);

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--text-red)",
                    boxShadow: "0 0 10px var(--text-red), 0 0 30px var(--text-red)",
                    pointerEvents: "none",
                    transform: `translate(${x - 8}px, ${y - 8}px)`,
                    zIndex: 500,
                }}
            />

            <div
                style={{
                    position: "fixed",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--text-red)",
                    pointerEvents: "none",
                    transform: `translate(${x - 20}px, ${y - 20}px)`,
                    opacity: 0.5,
                    zIndex: 499,
                }}
            />
        </>
    );
}