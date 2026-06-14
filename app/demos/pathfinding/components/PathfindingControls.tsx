"use client";

import { motion, AnimatePresence } from "framer-motion";
import ControlPanel from "../../../components/ui/ControlPanel";
import { PathfindingParams } from "../types";

interface PathfindingControlsProps {
    onRun: (params: PathfindingParams) => void;
    onReset: () => void;
    runState: string;
}

const DEFAULT_PARAMS: PathfindingParams = {
    algorithm: "astar",
    speed: 50,
};

export default function PathfindingControls({
    onRun,
    onReset,
    runState,
}: PathfindingControlsProps) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
            >
                <ControlPanel title="PATHFINDING CONTROLS">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <p>Status: {runState}</p>

                        <button onClick={() => onRun(DEFAULT_PARAMS)}>
                            RUN
                        </button>

                        <button onClick={onReset}>
                            RESET
                        </button>
                    </div>
                </ControlPanel>
            </motion.div>
        </AnimatePresence>
    );
}