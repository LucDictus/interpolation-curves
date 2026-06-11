"use client";

import { useEffect, useState } from "react";
import { useSecondOrder } from "../hooks/useSecondOrder";
import { SecondOrderParams } from "../types/SecondOrderParams";

type Props = {
  params: SecondOrderParams;
};

export default function CursorFollower({ params }: Props) {
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

  const x = useSecondOrder(mouse.x, params);
  const y = useSecondOrder(mouse.y, params);

  return (
    <div
      style={{
        position: "fixed",
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "red",
        pointerEvents: "none",

        transform: `translate(${x - 25}px, ${y - 25}px)`,
      }}
    />
  );
}