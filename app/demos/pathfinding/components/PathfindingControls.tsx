"use client";

import { motion, AnimatePresence } from "framer-motion";
import ControlPanel from "../../../components/ui/ControlPanel";
import { PathfindingParams, RunState } from "../types";

interface Props {
    onRun: (params: PathfindingParams) => void;
    onPause: () => void;
    onResume: () => void;
    onReset: () => void;
    runState: RunState;
    elapsedMs: number;
}

const DEFAULT_PARAMS: PathfindingParams = {
    algorithm: "astar",
    speed: 50,
};

const STATUS_COLORS: Record<RunState, string> = {
    idle:      "var(--text-muted)",
    running:   "var(--text-blue)",
    paused:    "var(--text-orange)",
    done:      "var(--text-green)",
    "no-path": "var(--text-red)",
};

const STATUS_LABELS: Record<RunState, string> = {
    idle:      "READY",
    running:   "SEARCHING",
    paused:    "PAUSED",
    done:      "PATH FOUND",
    "no-path": "NO PATH",
};

function formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    border: "1px solid rgba(255,255,255,.15)",
    background: "transparent",
    padding: "8px 10px",
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? "var(--text-muted)" : "var(--text-primary)",
    opacity: disabled ? 0.4 : 1,
    marginTop: 8,
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
});

export default function PathfindingControls({
                                                onRun,
                                                onPause,
                                                onResume,
                                                onReset,
                                                runState,
                                                elapsedMs,
                                            }: Props) {
    const isRunning = runState === "running";
    const isPaused  = runState === "paused";
    const isDone    = runState === "done" || runState === "no-path";
    const isIdle    = runState === "idle";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ transformOrigin: "top right" }}
            >
                <ControlPanel title="PATHFINDING">

                    {/* Status */}
                    <div style={{ marginTop: 12 }}>
                        <div className="label">STATUS</div>
                        <div
                            className="value"
                            style={{ color: STATUS_COLORS[runState] }}
                        >
                            {STATUS_LABELS[runState]}
                        </div>
                    </div>

                    {/* Timer */}
                    <div style={{ marginTop: 12 }}>
                        <div className="label">TIME</div>
                        <div className="value">
                            {elapsedMs > 0 ? formatTime(elapsedMs) : "—"}
                        </div>
                    </div>

                    {/* Run */}
                    <button
                        style={btnStyle(isRunning || isPaused)}
                        disabled={isRunning || isPaused}
                        onClick={() => onRun(DEFAULT_PARAMS)}
                    >
                        RUN
                    </button>

                    {/* Pause / Resume */}
                    {isRunning && (
                        <button style={btnStyle(false)} onClick={onPause}>
                            PAUSE
                        </button>
                    )}
                    {isPaused && (
                        <button style={btnStyle(false)} onClick={onResume}>
                            RESUME
                        </button>
                    )}

                    {/* Reset */}
                    <button
                        style={btnStyle(false)}
                        onClick={onReset}
                    >
                        RESET
                    </button>

                </ControlPanel>
            </motion.div>
        </AnimatePresence>
    );
}