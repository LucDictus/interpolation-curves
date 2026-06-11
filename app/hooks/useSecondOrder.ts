"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  frequency: number;
  damping: number;
  response: number;
};

export function useSecondOrder(
  target: number,
  { frequency, damping, response }: Options
) {
  const [value, setValue] = useState(target);

  const position = useRef(target);
  const velocity = useRef(0);
  const previousTarget = useRef(target);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const f = frequency;
    const zeta = damping;
    const r = response;

    const k1 = zeta / (Math.PI * f);
    const k2 = 1 / ((2 * Math.PI * f) ** 2);
    const k3 = (r * zeta) / (2 * Math.PI * f);

    const update = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.03);
      lastTime = now;

      const xd =
        (target - previousTarget.current) / Math.max(dt, 0.0001);

      previousTarget.current = target;

      const y = position.current;
      const yd = velocity.current;

      const acceleration =
        (target + k3 * xd - y - k1 * yd) / k2;

      velocity.current = yd + acceleration * dt;

      position.current =
        y + velocity.current * dt;

      setValue(position.current);

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameId);
  }, [target, frequency, damping, response]);

  return value;
}