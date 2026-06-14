"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ControlPanel from "../../../components/ui/ControlPanel";
import Slider from "../../../components/ui/Slider";
import { BoidsParams } from "../types";

type Props = {
    params: BoidsParams;
    setParams: React.Dispatch<React.SetStateAction<BoidsParams>>;
    onReset: () => void;
};

export default function BoidsControls({ params, setParams, onReset }: Props) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
            >
                <ControlPanel title="BOIDS CONTROLS">
                    <Slider
                        label="SEPARATION DIST"
                        min={10}
                        max={120}
                        step={1}
                        value={params.separationDist}
                        onChange={(v) => setParams(p => ({ ...p, separationDist: v }))}
                        decimals={0}
                    />

                    <Slider
                        label="ALIGNMENT FORCE"
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        value={params.alignmentForce}
                        onChange={(v) => setParams(p => ({ ...p, alignmentForce: v }))}
                    />

                    <Slider
                        label="COHESION FORCE"
                        min={0.0001}
                        max={0.02}
                        step={0.0001}
                        value={params.cohesionForce}
                        onChange={(v) => setParams(p => ({ ...p, cohesionForce: v }))}
                        decimals={4}
                    />

                    <Slider
                        label="SPEED"
                        min={0.5}
                        max={6}
                        step={0.1}
                        value={params.speed}
                        onChange={(v) => setParams(p => ({ ...p, speed: v }))}
                    />

                    <Slider
                        label="PREDATOR FORCE"
                        min={0}
                        max={0.5}
                        step={0.01}
                        value={params.predatorForce}
                        onChange={(v) => setParams(p => ({ ...p, predatorForce: v }))}
                    />

                    <button
                        onClick={onReset}
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
                </ControlPanel>
            </motion.div>
        </AnimatePresence>
    );
}