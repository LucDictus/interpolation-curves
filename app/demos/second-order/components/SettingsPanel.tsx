"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ControlPanel from "../../../components/ui/ControlPanel";
import Slider from "../../../components/ui/Slider";
import { SecondOrderParams } from "../types";

type Props = {
    params: SecondOrderParams;
    setParams: React.Dispatch<React.SetStateAction<SecondOrderParams>>;
};

export default function SettingsPanel({ params, setParams }: Props) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
            >
                <ControlPanel title="MOTION PARAMETERS">
                    <Slider
                        label="FREQUENCY"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={params.frequency}
                        onChange={(v) => setParams(p => ({ ...p, frequency: v }))}
                    />

                    <Slider
                        label="DAMPING"
                        min={0}
                        max={1}
                        step={0.01}
                        value={params.damping}
                        onChange={(v) => setParams(p => ({ ...p, damping: v }))}
                    />

                    <Slider
                        label="RESPONSE"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={params.response}
                        onChange={(v) => setParams(p => ({ ...p, response: v }))}
                    />

                    <button
                        onClick={() => setParams({ frequency: 1, damping: 0.7, response: 1 })}
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