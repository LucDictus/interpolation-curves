"use client";

import { useEffect, useState } from "react";
import { useSecondOrder } from "../hooks/useSecondOrder";

export default function CursorFollower() {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
  const handleMove = (e: MouseEvent) => {
    setMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

    window.addEventListener("mousemove", handleMove);
  
    return () =>
      window.removeEventListener("mousemove", handleMove);
  }, []);

  const x = useSecondOrder(mouse.x, {
    frequency: 2,
    damping: 0.5,
    response: 2,
  });

  const y = useSecondOrder(mouse.y, {
    frequency: 2,
    damping: 0.5,
    response: 2,
  });

  return (
    <div
      style={{
        position: "fixed",
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "red",
        pointerEvents: "none",

        transform: `translate(${x - 25}px, ${y - 50}px)`,
        }}
    />
  );
}