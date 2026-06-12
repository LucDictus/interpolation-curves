import { SecondOrderParams } from "../types/SecondOrderParams";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    params: SecondOrderParams;
    setParams: React.Dispatch<React.SetStateAction<SecondOrderParams>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SettingsTab({
                                        params,
                                        setParams,
                                    }: Props) {
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
                    <div className="label">MOTION PARAMETERS</div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">FREQUENCY</div>
                        <div className="value">{params.frequency.toFixed(2)}</div>

                        <input
                            style={{ width: "100%" }}
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={params.frequency}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    frequency: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">DAMPING</div>
                        <div className="value">{params.damping.toFixed(2)}</div>

                        <input
                            style={{ width: "100%" }}
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={params.damping}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    damping: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <div className="label">RESPONSE</div>
                        <div className="value">{params.response.toFixed(2)}</div>

                        <input
                            style={{ width: "100%" }}
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={params.response}
                            onChange={(e) =>
                                setParams((p) => ({
                                    ...p,
                                    response: Number(e.target.value),
                                }))
                            }
                        />
                    </div>

                    <button
                        onClick={() =>
                            setParams({
                                frequency: 1,
                                damping: 0.7,
                                response: 1,
                            })
                        }
                        style={{
                            marginTop: 15,
                            width: "100%",
                            border: "1px solid rgba(255,255,255,.15)",
                            background: "transparent",
                            padding: 10,
                            cursor: "pointer",
                        }}
                    >
                        RESET
                    </button>
                </motion.div>
            </AnimatePresence>
        </>
    );
}